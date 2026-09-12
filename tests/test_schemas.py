from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.models.schemas import CallAgentOutput, CallStatus


def test_success_without_time():
    out = CallAgentOutput(status=CallStatus.success)
    assert out.time is None


def test_follow_up_requires_time():
    out = CallAgentOutput(status=CallStatus.follow_up, time=datetime.now(timezone.utc))
    assert out.time is not None


def test_follow_up_without_time_rejected():
    with pytest.raises(ValidationError):
        CallAgentOutput(status=CallStatus.follow_up)


def test_success_with_time_rejected():
    with pytest.raises(ValidationError):
        CallAgentOutput(status=CallStatus.success, time=datetime.now(timezone.utc))


def test_extra_field_rejected():
    with pytest.raises(ValidationError):
        CallAgentOutput(status=CallStatus.success, extra="nope")
