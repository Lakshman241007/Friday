import logging

import httpx

from app.core.config import get_settings
from app.services.retry import TransientError, retry_on_transient

logger = logging.getLogger(__name__)

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"

# 5xx and 429 are worth another attempt; 4xx (bad key, bad audio) never will be.
RETRYABLE_STATUS_CODES = frozenset({408, 429, 500, 502, 503, 504})


class TranscriptionError(Exception):
    pass


def _post_to_sarvam(content: bytes, filename: str, content_type: str | None) -> str:
    settings = get_settings()
    headers = {"api-subscription-key": settings.sarvam_api_key}
    data = {"model": settings.sarvam_stt_model}
    files = {"file": (filename, content, content_type or "application/octet-stream")}

    try:
        response = httpx.post(
            SARVAM_STT_URL, headers=headers, data=data, files=files, timeout=60.0
        )
    except httpx.HTTPError as exc:
        # Network-level failure: connection reset, timeout, DNS blip.
        raise TransientError(f"Sarvam STT request failed: {exc}") from exc

    if response.status_code in RETRYABLE_STATUS_CODES:
        raise TransientError(
            f"Sarvam STT returned {response.status_code}: {response.text}"
        )
    if response.status_code != 200:
        raise TranscriptionError(
            f"Sarvam STT failed ({response.status_code}): {response.text}"
        )

    payload = response.json()
    transcript = payload.get("transcript")
    if transcript is None:
        raise TranscriptionError(f"Sarvam STT response missing transcript: {payload}")
    return transcript


def transcribe_audio(content: bytes, filename: str, content_type: str | None) -> str:
    """Send call audio to Sarvam STT ("Translator AI") and return the transcript.

    Transient failures (network errors, 429/5xx) are retried with backoff so a
    momentary blip doesn't permanently fail a call the agent already recorded.
    """
    settings = get_settings()
    if not settings.sarvam_api_key:
        raise TranscriptionError("SARVAM_API_KEY is not configured")

    try:
        return retry_on_transient(
            lambda: _post_to_sarvam(content, filename, content_type),
            description="Sarvam STT",
            attempts=settings.sarvam_retry_attempts,
            base_delay_seconds=settings.sarvam_retry_base_delay_seconds,
        )
    except RuntimeError as exc:
        # Retries exhausted - surface as the domain error the pipeline handles.
        raise TranscriptionError(str(exc)) from exc
