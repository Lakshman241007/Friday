from unittest.mock import MagicMock, patch

import httpx
import pytest

from app.services.transcription import TranscriptionError, transcribe_audio


def _settings_with_key():
    settings = MagicMock()
    settings.sarvam_api_key = "test-key"
    settings.sarvam_stt_model = "saaras:v3"
    settings.sarvam_retry_attempts = 3
    settings.sarvam_retry_base_delay_seconds = 0
    return settings


def test_transcribe_audio_success():
    fake_response = MagicMock(status_code=200)
    fake_response.json.return_value = {"transcript": "hello world"}

    with patch("app.services.transcription.get_settings", return_value=_settings_with_key()):
        with patch("app.services.transcription.httpx.post", return_value=fake_response) as post:
            transcript = transcribe_audio(b"audio-bytes", "call.wav", "audio/wav")

    assert transcript == "hello world"
    assert post.call_args.kwargs["headers"]["api-subscription-key"] == "test-key"


def test_transcribe_audio_missing_api_key():
    settings = MagicMock()
    settings.sarvam_api_key = ""

    with patch("app.services.transcription.get_settings", return_value=settings):
        with pytest.raises(TranscriptionError):
            transcribe_audio(b"audio-bytes", "call.wav", "audio/wav")


def test_transcribe_audio_non_200_raises():
    fake_response = MagicMock(status_code=500, text="server error")

    with patch("app.services.transcription.get_settings", return_value=_settings_with_key()):
        with patch("app.services.transcription.httpx.post", return_value=fake_response):
            with pytest.raises(TranscriptionError):
                transcribe_audio(b"audio-bytes", "call.wav", "audio/wav")


def test_transcribe_audio_network_error_raises():
    with patch("app.services.transcription.get_settings", return_value=_settings_with_key()):
        with patch(
            "app.services.transcription.httpx.post",
            side_effect=httpx.ConnectError("boom"),
        ):
            with pytest.raises(TranscriptionError):
                transcribe_audio(b"audio-bytes", "call.wav", "audio/wav")
