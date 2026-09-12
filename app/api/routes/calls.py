from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

from app.models.schemas import CallStatusResponse, CallUploadRequest, CallUploadResponse
from app.services.call_tracking import (
    CallAgentNotFound,
    CallAlreadyCompleted,
    CallNotFound,
    get_call_status,
    prepare_retry,
    run_call_pipeline,
    track_uploaded_call,
)
from app.services.storage import StorageError

router = APIRouter(prefix="/api/calls", tags=["calls"])

# A call recording that exceeds this is far more likely to be a mistake (or an
# abuse attempt) than a real sales call, and we hold it in memory to upload.
MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50 MB


def _validate_audio(content: bytes, content_type: str | None) -> None:
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded recording is empty.")
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Recording exceeds the {MAX_UPLOAD_BYTES // (1024 * 1024)}MB limit.",
        )
    # Browsers send audio/webm, audio/mp4, audio/wav, ...; be permissive within
    # audio/* but reject obviously wrong types (a PDF, an image) up front rather
    # than paying for a storage round-trip and a Sarvam call to find out.
    if content_type and not content_type.startswith("audio/"):
        raise HTTPException(
            status_code=415,
            detail=f"Expected an audio file, got '{content_type}'.",
        )


@router.post("/upload", response_model=CallUploadResponse)
async def upload_call_recording(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    call_agent_code: str = Form(...),
    customer_number: str | None = Form(None),
    customer_name: str | None = Form(None),
    occurred_at: datetime | None = Form(None),
) -> CallUploadResponse:
    content = await file.read()
    _validate_audio(content, file.content_type)

    request = CallUploadRequest(
        call_agent_code=call_agent_code,
        customer_number=customer_number,
        customer_name=customer_name,
        occurred_at=occurred_at,
    )
    filename = file.filename or "recording"

    try:
        result = track_uploaded_call(request, filename, content, file.content_type)
    except CallAgentNotFound as exc:
        raise HTTPException(status_code=404, detail=f"Unknown call agent code: {exc}") from exc
    except StorageError as exc:
        raise HTTPException(
            status_code=502, detail=f"Could not store the recording: {exc}"
        ) from exc

    # Translator AI kicks off the moment the recording lands - no separate
    # trigger needed on the call-agent UI side. The task takes only the id and
    # re-reads the audio from storage, so the same path serves a later retry.
    background_tasks.add_task(run_call_pipeline, result.call_id)
    return result


@router.get("/{call_id}", response_model=CallStatusResponse)
def get_call(call_id: str) -> CallStatusResponse:
    """Polled by the call-agent UI while the pipeline runs in the background."""
    result = get_call_status(call_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Call not found: {call_id}")
    return result


@router.post("/{call_id}/retry", response_model=CallStatusResponse)
def retry_call(call_id: str, background_tasks: BackgroundTasks) -> CallStatusResponse:
    """Re-run the pipeline for a call that failed or was left mid-flight.

    Resumes from whatever is already durably recorded - a call that got as far
    as a transcript is not re-transcribed - so the agent never has to upload
    the recording again.
    """
    try:
        prepare_retry(call_id)
    except CallNotFound as exc:
        raise HTTPException(status_code=404, detail=f"Call not found: {exc}") from exc
    except CallAlreadyCompleted as exc:
        raise HTTPException(
            status_code=409, detail=f"Call {exc} has already completed."
        ) from exc

    background_tasks.add_task(run_call_pipeline, call_id)

    status = get_call_status(call_id)
    assert status is not None  # prepare_retry already proved the call exists
    return status
