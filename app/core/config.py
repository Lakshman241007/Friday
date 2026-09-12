from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_storage_bucket: str = "call-recordings"

    sarvam_api_key: str = ""
    sarvam_stt_model: str = "saaras:v3"
    sarvam_chat_model: str = "sarvam-105b"

    # How hard to retry Sarvam when it returns a transient failure (network
    # error, 429, 5xx). Set the delay to 0 in tests to keep them fast.
    sarvam_retry_attempts: int = 3
    sarvam_retry_base_delay_seconds: float = 1.0

    # Comma-separated list of origins allowed to call this API (the frontend
    # dev server and, eventually, its deployed origin).
    cors_allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
