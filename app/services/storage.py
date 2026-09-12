import uuid

from app.core.config import get_settings
from app.core.supabase_client import get_supabase


class StorageError(Exception):
    pass


def upload_recording(call_id: str, filename: str, content: bytes, content_type: str | None) -> str:
    """Upload raw call audio to the recordings bucket, return its storage path."""
    settings = get_settings()
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "bin"
    storage_path = f"{call_id}/{uuid.uuid4()}.{ext}"

    try:
        get_supabase().storage.from_(settings.supabase_storage_bucket).upload(
            storage_path,
            content,
            {"content-type": content_type or "application/octet-stream"},
        )
    except Exception as exc:  # supabase-py raises assorted client/network errors
        raise StorageError(f"Failed to upload recording: {exc}") from exc
    return storage_path


def download_recording(storage_path: str) -> bytes:
    """Read call audio back out of storage.

    The pipeline re-reads audio from storage rather than keeping it in memory,
    so a failed or interrupted call can be retried later without the agent
    having to upload the recording again.
    """
    settings = get_settings()
    try:
        return get_supabase().storage.from_(settings.supabase_storage_bucket).download(
            storage_path
        )
    except Exception as exc:
        raise StorageError(f"Failed to download recording {storage_path}: {exc}") from exc
