from unittest.mock import patch

import pytest

from app.models.schemas import CallAgentOutput, CallStatus
from app.services.call_tracking import (
    CallAlreadyCompleted,
    CallNotFound,
    get_call_status,
    prepare_retry,
    run_call_pipeline,
)
from app.services.intent_classification import IntentClassificationError
from app.services.storage import StorageError
from app.services.transcription import TranscriptionError
from tests.fake_supabase import FakeSupabase


def _seed_call(fake_db: FakeSupabase, *, status="uploaded", transcript=None) -> str:
    agent = fake_db.table("call_agents").insert({"code": "CA01"}).execute().data[0]
    call = (
        fake_db.table("calls")
        .insert({"call_agent_id": agent["id"], "status": status, "attempts": 0})
        .execute()
        .data[0]
    )
    fake_db.table("recordings").insert(
        {
            "call_id": call["id"],
            "storage_path": f"{call['id']}/audio.wav",
            "transcript": transcript,
            "uploaded_at": "2026-08-21T10:00:00",
        }
    ).execute()
    return call["id"]


def _patch_db(fake_db: FakeSupabase):
    return patch("app.services.call_tracking.get_supabase", return_value=fake_db)


def test_pipeline_success_transcribes_classifies_and_persists():
    fake_db = FakeSupabase()
    call_id = _seed_call(fake_db)

    with _patch_db(fake_db), \
         patch("app.services.persistence.get_supabase", return_value=fake_db), \
         patch("app.services.call_tracking.download_recording", return_value=b"audio"), \
         patch("app.services.call_tracking.transcribe_audio", return_value="hello there"), \
         patch(
             "app.services.call_tracking.classify_intent",
             return_value=CallAgentOutput(status=CallStatus.success),
         ):
        run_call_pipeline(call_id)

    call = fake_db.table("calls").eq("id", call_id).execute().data[0]
    assert call["status"] == "completed"
    assert call["attempts"] == 1
    recording = fake_db.table("recordings").eq("call_id", call_id).execute().data[0]
    assert recording["transcript"] == "hello there"
    assert fake_db.table("call_outcomes").eq("call_id", call_id).execute().data[0][
        "status"
    ] == "success"


def test_pipeline_records_transcription_failure_reason():
    fake_db = FakeSupabase()
    call_id = _seed_call(fake_db)

    with _patch_db(fake_db), \
         patch("app.services.call_tracking.download_recording", return_value=b"audio"), \
         patch(
             "app.services.call_tracking.transcribe_audio",
             side_effect=TranscriptionError("Sarvam STT unavailable"),
         ):
        run_call_pipeline(call_id)

    call = fake_db.table("calls").eq("id", call_id).execute().data[0]
    assert call["status"] == "failed"
    assert call["failed_stage"] == "transcription"
    assert "Sarvam STT unavailable" in call["error_message"]


def test_pipeline_records_storage_failure_as_transcription_stage():
    fake_db = FakeSupabase()
    call_id = _seed_call(fake_db)

    with _patch_db(fake_db), \
         patch(
             "app.services.call_tracking.download_recording",
             side_effect=StorageError("object missing"),
         ):
        run_call_pipeline(call_id)

    call = fake_db.table("calls").eq("id", call_id).execute().data[0]
    assert call["status"] == "failed"
    assert call["failed_stage"] == "transcription"
    assert "object missing" in call["error_message"]


def test_pipeline_records_classification_failure_reason():
    fake_db = FakeSupabase()
    call_id = _seed_call(fake_db)

    with _patch_db(fake_db), \
         patch("app.services.call_tracking.download_recording", return_value=b"audio"), \
         patch("app.services.call_tracking.transcribe_audio", return_value="mumbled audio"), \
         patch(
             "app.services.call_tracking.classify_intent",
             side_effect=IntentClassificationError("invalid JSON from model"),
         ):
        run_call_pipeline(call_id)

    call = fake_db.table("calls").eq("id", call_id).execute().data[0]
    assert call["status"] == "failed"
    assert call["failed_stage"] == "classification"
    # The transcript still got saved, so a retry won't re-transcribe.
    assert fake_db.table("recordings").eq("call_id", call_id).execute().data[0][
        "transcript"
    ] == "mumbled audio"


def test_retry_skips_transcription_when_transcript_already_exists():
    """The key resumability property: a call that already has a transcript is
    re-classified without paying for Sarvam STT again."""
    fake_db = FakeSupabase()
    call_id = _seed_call(fake_db, status="failed", transcript="already transcribed")

    with _patch_db(fake_db), \
         patch("app.services.persistence.get_supabase", return_value=fake_db), \
         patch("app.services.call_tracking.transcribe_audio") as transcribe, \
         patch("app.services.call_tracking.download_recording") as download, \
         patch(
             "app.services.call_tracking.classify_intent",
             return_value=CallAgentOutput(status=CallStatus.reject),
         ):
        run_call_pipeline(call_id)

    transcribe.assert_not_called()
    download.assert_not_called()
    call = fake_db.table("calls").eq("id", call_id).execute().data[0]
    assert call["status"] == "completed"
    assert call["failed_stage"] is None
    assert call["error_message"] is None


def test_pipeline_missing_recording_marks_failed():
    fake_db = FakeSupabase()
    agent = fake_db.table("call_agents").insert({"code": "CA01"}).execute().data[0]
    call = (
        fake_db.table("calls")
        .insert({"call_agent_id": agent["id"], "status": "uploaded", "attempts": 0})
        .execute()
        .data[0]
    )

    with _patch_db(fake_db):
        run_call_pipeline(call["id"])

    stored = fake_db.table("calls").eq("id", call["id"]).execute().data[0]
    assert stored["status"] == "failed"
    assert "No recording" in stored["error_message"]


def test_pipeline_unknown_call_is_noop():
    fake_db = FakeSupabase()
    with _patch_db(fake_db), patch("app.services.call_tracking.transcribe_audio") as t:
        run_call_pipeline("does-not-exist")
    t.assert_not_called()


def test_prepare_retry_rejects_unknown_and_completed_calls():
    fake_db = FakeSupabase()
    done_id = _seed_call(fake_db, status="completed")
    failed_id = _seed_call(fake_db, status="failed")

    with _patch_db(fake_db):
        with pytest.raises(CallNotFound):
            prepare_retry("nope")
        with pytest.raises(CallAlreadyCompleted):
            prepare_retry(done_id)
        prepare_retry(failed_id)  # allowed


def test_get_call_status_unknown_call_returns_none():
    fake_db = FakeSupabase()
    with _patch_db(fake_db):
        assert get_call_status("missing-call") is None


def test_get_call_status_surfaces_failure_reason():
    fake_db = FakeSupabase()
    call_id = _seed_call(fake_db)
    fake_db.table("calls").update(
        {"status": "failed", "failed_stage": "transcription", "error_message": "boom"}
    ).eq("id", call_id).execute()

    with _patch_db(fake_db):
        result = get_call_status(call_id)

    assert result.status == "failed"
    assert result.failed_stage == "transcription"
    assert result.error_message == "boom"


def test_get_call_status_completed_includes_transcript_and_outcome():
    fake_db = FakeSupabase()
    call_id = _seed_call(fake_db, status="completed", transcript="hello there")
    fake_db.table("call_outcomes").insert(
        {"call_id": call_id, "status": "success", "follow_up_time": None}
    ).execute()

    with _patch_db(fake_db):
        result = get_call_status(call_id)

    assert result.status == "completed"
    assert result.transcript == "hello there"
    assert result.outcome == CallAgentOutput(status=CallStatus.success)
