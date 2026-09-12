import logging

from app.core.supabase_client import get_supabase
from app.models.schemas import (
    CallAgentOutput,
    CallStatusResponse,
    CallUploadRequest,
    CallUploadResponse,
)
from app.services.intent_classification import IntentClassificationError, classify_intent
from app.services.persistence import persist_call_outcome
from app.services.storage import StorageError, download_recording, upload_recording
from app.services.transcription import TranscriptionError, transcribe_audio

logger = logging.getLogger(__name__)


class CallAgentNotFound(Exception):
    pass


def track_uploaded_call(
    request: CallUploadRequest, filename: str, content: bytes, content_type: str | None
) -> CallUploadResponse:
    """The 'call tracking process': create the call record, store the audio,
    and link the two so the recording is traceable from the moment it lands —
    even before transcription/classification run.
    """
    supabase = get_supabase()

    agent_res = (
        supabase.table("call_agents")
        .select("id")
        .eq("code", request.call_agent_code)
        .limit(1)
        .execute()
    )
    if not agent_res.data:
        raise CallAgentNotFound(request.call_agent_code)
    call_agent_id = agent_res.data[0]["id"]

    call_row = {
        "call_agent_id": call_agent_id,
        "customer_number": request.customer_number,
        "customer_name": request.customer_name,
    }
    if request.occurred_at is not None:
        call_row["occurred_at"] = request.occurred_at.isoformat()

    call_res = supabase.table("calls").insert(call_row).execute()
    call_id = call_res.data[0]["id"]

    storage_path = upload_recording(call_id, filename, content, content_type)

    recording_res = (
        supabase.table("recordings")
        .insert({"call_id": call_id, "storage_path": storage_path})
        .execute()
    )
    recording_id = recording_res.data[0]["id"]

    return CallUploadResponse(
        call_id=call_id, recording_id=recording_id, storage_path=storage_path
    )


class CallNotFound(Exception):
    pass


class CallAlreadyCompleted(Exception):
    pass


def _mark_failed(call_id: str, stage: str, message: str) -> None:
    get_supabase().table("calls").update(
        {"status": "failed", "failed_stage": stage, "error_message": message[:1000]}
    ).eq("id", call_id).execute()


def run_call_pipeline(call_id: str) -> None:
    """Translator AI -> Intent classification -> OP, for one call.

    Deliberately takes only a call_id and re-derives everything else from the
    database (including re-reading the audio from storage). That makes the
    whole pipeline *resumable*: the same function serves the initial run
    fired off the upload and a later retry of a call that failed or was left
    stranded mid-flight by a process restart. It skips any stage whose work
    is already durably recorded, so a retry after classification failure
    doesn't pay for transcription again.

    Runs as a background task after the upload response has already been
    sent, so failures are recorded on the call row rather than raised.
    """
    supabase = get_supabase()

    call_res = (
        supabase.table("calls")
        .select("id, call_agent_id, status, attempts")
        .eq("id", call_id)
        .limit(1)
        .execute()
    )
    if not call_res.data:
        logger.error("Call %s not found; abandoning pipeline", call_id)
        return
    call = call_res.data[0]
    call_agent_id = call["call_agent_id"]

    supabase.table("calls").update({"attempts": (call.get("attempts") or 0) + 1}).eq(
        "id", call_id
    ).execute()

    recording_res = (
        supabase.table("recordings")
        .select("id, storage_path, transcript")
        .eq("call_id", call_id)
        .order("uploaded_at", desc=True)
        .limit(1)
        .execute()
    )
    if not recording_res.data:
        _mark_failed(call_id, "transcription", "No recording found for this call")
        return
    recording = recording_res.data[0]
    transcript = recording.get("transcript")

    # --- Translator AI (skipped if we already have a transcript) ---------
    if not transcript:
        try:
            content = download_recording(recording["storage_path"])
            transcript = transcribe_audio(
                content, recording["storage_path"].rsplit("/", 1)[-1], None
            )
        except (StorageError, TranscriptionError) as exc:
            logger.exception("Translator AI failed for call %s", call_id)
            _mark_failed(call_id, "transcription", str(exc))
            return

        supabase.table("recordings").update({"transcript": transcript}).eq(
            "id", recording["id"]
        ).execute()
        supabase.table("calls").update(
            {"status": "transcribed", "failed_stage": None, "error_message": None}
        ).eq("id", call_id).execute()

    # --- Intent classification + OP persistence --------------------------
    try:
        output = classify_intent(transcript)
    except IntentClassificationError as exc:
        logger.exception("Intent classification failed for call %s", call_id)
        _mark_failed(call_id, "classification", str(exc))
        return

    persist_call_outcome(call_id, call_agent_id, output)
    supabase.table("calls").update(
        {"status": "completed", "failed_stage": None, "error_message": None}
    ).eq("id", call_id).execute()


def prepare_retry(call_id: str) -> None:
    """Validate that a call can be retried, before re-running the pipeline.

    Raises rather than returning a flag so the route can map each case to the
    right HTTP status.
    """
    supabase = get_supabase()
    res = supabase.table("calls").select("id, status").eq("id", call_id).limit(1).execute()
    if not res.data:
        raise CallNotFound(call_id)
    if res.data[0]["status"] == "completed":
        raise CallAlreadyCompleted(call_id)


def get_call_status(call_id: str) -> CallStatusResponse | None:
    """Read-side for the call-agent UI to poll while the pipeline runs in
    the background: current status, transcript once available, and the
    validated OP outcome once classification has persisted it.
    """
    supabase = get_supabase()

    call_res = (
        supabase.table("calls")
        .select("id, status, failed_stage, error_message")
        .eq("id", call_id)
        .limit(1)
        .execute()
    )
    if not call_res.data:
        return None
    call = call_res.data[0]

    recording_res = (
        supabase.table("recordings")
        .select("transcript")
        .eq("call_id", call_id)
        .order("uploaded_at", desc=True)
        .limit(1)
        .execute()
    )
    transcript = recording_res.data[0].get("transcript") if recording_res.data else None

    outcome = None
    outcome_res = (
        supabase.table("call_outcomes")
        .select("status, follow_up_time")
        .eq("call_id", call_id)
        .limit(1)
        .execute()
    )
    if outcome_res.data:
        row = outcome_res.data[0]
        outcome = CallAgentOutput(status=row["status"], time=row.get("follow_up_time"))

    return CallStatusResponse(
        call_id=call_id,
        status=call["status"],
        transcript=transcript,
        outcome=outcome,
        failed_stage=call.get("failed_stage"),
        error_message=call.get("error_message"),
    )
