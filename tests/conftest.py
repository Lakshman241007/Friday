import os

# Retry backoff sleeps would otherwise add seconds of dead time to the suite;
# the backoff *arithmetic* is covered directly in tests/test_retry.py.
os.environ.setdefault("SARVAM_RETRY_BASE_DELAY_SECONDS", "0")
