import json
from unittest.mock import MagicMock, patch

import pytest

from app.models.schemas import CallAgentOutput, CallStatus
from app.services.intent_classification import (
    IntentClassificationError,
    classify_intent,
)


def _settings_with_key():
    settings = MagicMock()
    settings.sarvam_api_key = "test-key"
    settings.sarvam_chat_model = "sarvam-105b"
    settings.sarvam_retry_attempts = 3
    settings.sarvam_retry_base_delay_seconds = 0
    return settings


def _fake_chat_response(content_dict: dict) -> MagicMock:
    response = MagicMock(status_code=200)
    response.json.return_value = {
        "choices": [{"message": {"content": json.dumps(content_dict)}}]
    }
    return response


def test_classify_intent_success():
    fake_response = _fake_chat_response({"status": "success"})
    with patch(
        "app.services.intent_classification.get_settings",
        return_value=_settings_with_key(),
    ):
        with patch(
            "app.services.intent_classification.httpx.post", return_value=fake_response
        ):
            result = classify_intent("customer confirmed the order")

    assert result == CallAgentOutput(status=CallStatus.success)


def test_classify_intent_follow_up_requires_time():
    fake_response = _fake_chat_response(
        {"status": "follow-up", "time": "2026-08-25T10:00:00Z"}
    )
    with patch(
        "app.services.intent_classification.get_settings",
        return_value=_settings_with_key(),
    ):
        with patch(
            "app.services.intent_classification.httpx.post", return_value=fake_response
        ):
            result = classify_intent("call me back next week")

    assert result.status == CallStatus.follow_up
    assert result.time is not None


def test_classify_intent_invalid_json_raises():
    response = MagicMock(status_code=200)
    response.json.return_value = {"choices": [{"message": {"content": "not json"}}]}
    with patch(
        "app.services.intent_classification.get_settings",
        return_value=_settings_with_key(),
    ):
        with patch("app.services.intent_classification.httpx.post", return_value=response):
            with pytest.raises(IntentClassificationError):
                classify_intent("garbled transcript")


def test_classify_intent_contract_violation_raises():
    # follow-up without required time violates the CallAgentOutput contract
    fake_response = _fake_chat_response({"status": "follow-up"})
    with patch(
        "app.services.intent_classification.get_settings",
        return_value=_settings_with_key(),
    ):
        with patch(
            "app.services.intent_classification.httpx.post", return_value=fake_response
        ):
            with pytest.raises(IntentClassificationError):
                classify_intent("ambiguous transcript")


def test_classify_intent_missing_api_key_raises():
    settings = MagicMock()
    settings.sarvam_api_key = ""
    with patch("app.services.intent_classification.get_settings", return_value=settings):
        with pytest.raises(IntentClassificationError):
            classify_intent("any transcript")
