from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.models.schemas import CallUploadResponse
from app.services.call_tracking import CallAgentNotFound
from app.services.storage import StorageError

client = TestClient(app)


def test_upload_success_kicks_off_pipeline():
    fake_response = CallUploadResponse(
        call_id="call-1", recording_id="rec-1", storage_path="call-1/rec-1.wav"
    )
    with patch("app.api.routes.calls.track_uploaded_call", return_value=fake_response), \
         patch("app.api.routes.calls.run_call_pipeline") as run_pipeline:
        resp = client.post(
            "/api/calls/upload",
            data={"call_agent_code": "CA01", "customer_number": "+15550001111"},
            files={"file": ("recording.wav", b"fake-audio-bytes", "audio/wav")},
        )
    assert resp.status_code == 200
    assert resp.json() == fake_response.model_dump()
    run_pipeline.assert_called_once_with("call-1")


def test_upload_unknown_agent_returns_404():
    with patch(
        "app.api.routes.calls.track_uploaded_call",
        side_effect=CallAgentNotFound("CA99"),
    ):
        resp = client.post(
            "/api/calls/upload",
            data={"call_agent_code": "CA99"},
            files={"file": ("recording.wav", b"fake-audio-bytes", "audio/wav")},
        )
    assert resp.status_code == 404


def test_upload_storage_failure_returns_502():
    with patch(
        "app.api.routes.calls.track_uploaded_call",
        side_effect=StorageError("bucket unreachable"),
    ):
        resp = client.post(
            "/api/calls/upload",
            data={"call_agent_code": "CA01"},
            files={"file": ("recording.wav", b"fake-audio-bytes", "audio/wav")},
        )
    assert resp.status_code == 502


def test_upload_rejects_empty_file():
    resp = client.post(
        "/api/calls/upload",
        data={"call_agent_code": "CA01"},
        files={"file": ("recording.wav", b"", "audio/wav")},
    )
    assert resp.status_code == 400


def test_upload_rejects_non_audio_content_type():
    resp = client.post(
        "/api/calls/upload",
        data={"call_agent_code": "CA01"},
        files={"file": ("notes.pdf", b"%PDF-1.4 fake", "application/pdf")},
    )
    assert resp.status_code == 415


def test_upload_rejects_oversized_file():
    from app.api.routes.calls import MAX_UPLOAD_BYTES

    oversized = b"x" * (MAX_UPLOAD_BYTES + 1)
    resp = client.post(
        "/api/calls/upload",
        data={"call_agent_code": "CA01"},
        files={"file": ("huge.wav", oversized, "audio/wav")},
    )
    assert resp.status_code == 413
