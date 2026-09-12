"""End-to-end pipeline test through the real HTTP API: upload a recording,
let the background pipeline run, and confirm the call ends up transcribed,
classified, and persisted correctly - all exercised through the actual
FastAPI routes and service code, not by calling functions directly.

Only the external AI boundaries (Sarvam STT + chat) are mocked; the Supabase
layer is a real in-memory stand-in (tests/fake_supabase.py) that round-trips
audio bytes through storage, so this proves the wiring between call_tracking,
storage, transcription, intent_classification, and persistence actually holds
together - including that the pipeline can re-read the audio it stored.
"""

from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.models.schemas import CallAgentOutput, CallStatus
from app.services.intent_classification import IntentClassificationError
from app.services.transcription import TranscriptionError
from tests.fake_supabase import FakeSupabase

client = TestClient(app)


def _seed_agent(fake_db: FakeSupabase, code: str = "CA01") -> None:
    fake_db.table("call_agents").insert(
        {"code": code, "display_name": "Agent One", "active": True}
    ).execute()


def _db_patches(fake_db: FakeSupabase):
    return (
        patch("app.services.call_tracking.get_supabase", return_value=fake_db),
        patch("app.services.storage.get_supabase", return_value=fake_db),
        patch("app.services.persistence.get_supabase", return_value=fake_db),
    )


def _upload(agent_code: str = "CA01"):
    return client.post(
        "/api/calls/upload",
        data={
            "call_agent_code": agent_code,
            "customer_number": "+15550001111",
            "customer_name": "Jane Doe",
        },
        files={"file": ("call.wav", b"fake-audio-bytes", "audio/wav")},
    )


def test_full_pipeline_success_via_http():
    fake_db = FakeSupabase()
    _seed_agent(fake_db)
    p1, p2, p3 = _db_patches(fake_db)

    with p1, p2, p3, \
         patch(
             "app.services.call_tracking.transcribe_audio",
             return_value="Customer agreed to move forward with the plan.",
         ) as transcribe, \
         patch(
             "app.services.call_tracking.classify_intent",
             return_value=CallAgentOutput(status=CallStatus.success),
         ):
        upload_resp = _upload()
        assert upload_resp.status_code == 200
        call_id = upload_resp.json()["call_id"]

        status_resp = client.get(f"/api/calls/{call_id}")

    # The pipeline re-read the audio it just stored, rather than being handed
    # the bytes - that round-trip is what makes retries possible.
    assert transcribe.call_args.args[0] == b"fake-audio-bytes"

    body = status_resp.json()
    assert body["status"] == "completed"
    assert body["transcript"] == "Customer agreed to move forward with the plan."
    assert body["outcome"] == {"status": "success", "time": None}
    assert body["error_message"] is None

    assert len(fake_db._store["call_outcomes"]) == 1
    assert fake_db._store["call_outcomes"][0]["status"] == "success"


def test_follow_up_outcome_persists_time_via_http():
    fake_db = FakeSupabase()
    _seed_agent(fake_db)
    p1, p2, p3 = _db_patches(fake_db)
    follow_up = CallAgentOutput(status=CallStatus.follow_up, time="2026-08-25T10:00:00Z")

    with p1, p2, p3, \
         patch("app.services.call_tracking.transcribe_audio", return_value="call me next week"), \
         patch("app.services.call_tracking.classify_intent", return_value=follow_up):
        call_id = _upload().json()["call_id"]
        body = client.get(f"/api/calls/{call_id}").json()

    assert body["status"] == "completed"
    assert body["outcome"]["status"] == "follow-up"
    assert body["outcome"]["time"] is not None
    assert fake_db._store["call_outcomes"][0]["follow_up_time"] is not None


def test_pipeline_transcription_failure_records_reason_via_http():
    fake_db = FakeSupabase()
    _seed_agent(fake_db)
    p1, p2, p3 = _db_patches(fake_db)

    with p1, p2, p3, \
         patch(
             "app.services.call_tracking.transcribe_audio",
             side_effect=TranscriptionError("Sarvam STT unavailable"),
         ):
        call_id = _upload().json()["call_id"]
        body = client.get(f"/api/calls/{call_id}").json()

    assert body["status"] == "failed"
    assert body["failed_stage"] == "transcription"
    assert "Sarvam STT unavailable" in body["error_message"]
    assert body["outcome"] is None
    assert len(fake_db._store.get("call_outcomes", [])) == 0


def test_pipeline_classification_failure_keeps_transcript_via_http():
    fake_db = FakeSupabase()
    _seed_agent(fake_db)
    p1, p2, p3 = _db_patches(fake_db)

    with p1, p2, p3, \
         patch("app.services.call_tracking.transcribe_audio", return_value="garbled unclear audio"), \
         patch(
             "app.services.call_tracking.classify_intent",
             side_effect=IntentClassificationError("model returned invalid JSON"),
         ):
        call_id = _upload().json()["call_id"]
        body = client.get(f"/api/calls/{call_id}").json()

    assert body["status"] == "failed"
    assert body["failed_stage"] == "classification"
    # Transcript survived, so the retry below won't need to transcribe again.
    assert body["transcript"] == "garbled unclear audio"
    assert body["outcome"] is None


def test_retry_after_classification_failure_completes_without_retranscribing():
    """The full recovery story end-to-end: a call fails at classification,
    the agent retries, and it completes - without re-uploading the recording
    or paying for transcription a second time."""
    fake_db = FakeSupabase()
    _seed_agent(fake_db)
    p1, p2, p3 = _db_patches(fake_db)

    with p1, p2, p3, \
         patch("app.services.call_tracking.transcribe_audio", return_value="wants a proposal") as transcribe, \
         patch(
             "app.services.call_tracking.classify_intent",
             side_effect=IntentClassificationError("transient model error"),
         ):
        call_id = _upload().json()["call_id"]
        assert client.get(f"/api/calls/{call_id}").json()["status"] == "failed"
        assert transcribe.call_count == 1

    with p1, p2, p3, \
         patch("app.services.call_tracking.transcribe_audio") as transcribe_again, \
         patch(
             "app.services.call_tracking.classify_intent",
             return_value=CallAgentOutput(status=CallStatus.success),
         ):
        retry_resp = client.post(f"/api/calls/{call_id}/retry")
        assert retry_resp.status_code == 200
        body = client.get(f"/api/calls/{call_id}").json()

    transcribe_again.assert_not_called()
    assert body["status"] == "completed"
    assert body["outcome"]["status"] == "success"
    assert body["failed_stage"] is None
    assert body["error_message"] is None


def test_retry_on_completed_call_returns_409():
    fake_db = FakeSupabase()
    _seed_agent(fake_db)
    p1, p2, p3 = _db_patches(fake_db)

    with p1, p2, p3, \
         patch("app.services.call_tracking.transcribe_audio", return_value="all good"), \
         patch(
             "app.services.call_tracking.classify_intent",
             return_value=CallAgentOutput(status=CallStatus.success),
         ):
        call_id = _upload().json()["call_id"]
        assert client.get(f"/api/calls/{call_id}").json()["status"] == "completed"
        retry_resp = client.post(f"/api/calls/{call_id}/retry")

    assert retry_resp.status_code == 409


def test_retry_unknown_call_returns_404():
    fake_db = FakeSupabase()
    with patch("app.services.call_tracking.get_supabase", return_value=fake_db):
        resp = client.post("/api/calls/does-not-exist/retry")
    assert resp.status_code == 404


def test_get_call_status_unknown_id_returns_404():
    fake_db = FakeSupabase()
    with patch("app.services.call_tracking.get_supabase", return_value=fake_db):
        resp = client.get("/api/calls/does-not-exist")
    assert resp.status_code == 404


def test_upload_unknown_agent_code_returns_404_and_creates_nothing():
    fake_db = FakeSupabase()
    with patch("app.services.call_tracking.get_supabase", return_value=fake_db):
        resp = _upload(agent_code="GHOST")
    assert resp.status_code == 404
    assert fake_db._store.get("calls", []) == []
