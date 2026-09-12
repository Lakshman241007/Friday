import pytest

from app.services.retry import TransientError, retry_on_transient


def test_returns_immediately_on_success():
    calls = []

    def fn():
        calls.append(1)
        return "ok"

    assert retry_on_transient(fn, description="op", sleep=lambda _: None) == "ok"
    assert len(calls) == 1


def test_retries_transient_then_succeeds():
    attempts = []

    def fn():
        attempts.append(1)
        if len(attempts) < 3:
            raise TransientError("blip")
        return "recovered"

    result = retry_on_transient(fn, description="op", sleep=lambda _: None)
    assert result == "recovered"
    assert len(attempts) == 3


def test_gives_up_after_configured_attempts():
    attempts = []

    def fn():
        attempts.append(1)
        raise TransientError("still down")

    with pytest.raises(RuntimeError, match="failed after 3 attempts"):
        retry_on_transient(fn, description="op", sleep=lambda _: None)
    assert len(attempts) == 3


def test_non_transient_error_is_not_retried():
    """A bad API key or malformed request will never succeed on retry, so
    retrying only delays the failure the agent needs to see."""
    attempts = []

    def fn():
        attempts.append(1)
        raise ValueError("bad request")

    with pytest.raises(ValueError):
        retry_on_transient(fn, description="op", sleep=lambda _: None)
    assert len(attempts) == 1


def test_backoff_delays_grow_exponentially():
    delays: list[float] = []

    def fn():
        raise TransientError("down")

    with pytest.raises(RuntimeError):
        retry_on_transient(
            fn,
            description="op",
            attempts=4,
            base_delay_seconds=1.0,
            sleep=delays.append,
        )
    assert delays == [1.0, 2.0, 4.0]
