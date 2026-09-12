import logging
import time
from typing import Callable, TypeVar

logger = logging.getLogger(__name__)

T = TypeVar("T")

# Sarvam is an external network dependency: a blip or a 5xx shouldn't
# permanently fail a call the agent already recorded.
DEFAULT_ATTEMPTS = 3
DEFAULT_BASE_DELAY_SECONDS = 1.0


class TransientError(Exception):
    """Raised by a callable to signal the failure is worth retrying."""


def retry_on_transient(
    fn: Callable[[], T],
    *,
    description: str,
    attempts: int = DEFAULT_ATTEMPTS,
    base_delay_seconds: float = DEFAULT_BASE_DELAY_SECONDS,
    sleep: Callable[[float], None] = time.sleep,
) -> T:
    """Call `fn`, retrying with exponential backoff while it raises TransientError.

    Non-transient exceptions propagate immediately - a malformed request or a
    bad API key will never succeed on retry, so retrying just delays the
    failure the agent needs to see.
    """
    last_error: TransientError | None = None
    for attempt in range(1, attempts + 1):
        try:
            return fn()
        except TransientError as exc:
            last_error = exc
            if attempt == attempts:
                break
            delay = base_delay_seconds * (2 ** (attempt - 1))
            logger.warning(
                "%s failed (attempt %d/%d), retrying in %.1fs: %s",
                description,
                attempt,
                attempts,
                delay,
                exc,
            )
            sleep(delay)

    raise RuntimeError(f"{description} failed after {attempts} attempts: {last_error}")
