from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, model_validator


class CallStatus(str, Enum):
    success = "success"
    reject = "reject"
    follow_up = "follow-up"


class CallAgentOutput(BaseModel):
    """The OP contract: exactly these fields, enforced structurally.

    `time` is required when status is follow-up, and forbidden otherwise —
    the diagram allows it only "for the follow up".
    """

    model_config = ConfigDict(extra="forbid")

    status: CallStatus
    time: datetime | None = None

    @model_validator(mode="after")
    def _time_matches_status(self) -> "CallAgentOutput":
        if self.status == CallStatus.follow_up and self.time is None:
            raise ValueError("time is required when status is 'follow-up'")
        if self.status != CallStatus.follow_up and self.time is not None:
            raise ValueError("time is only allowed when status is 'follow-up'")
        return self


class CallUploadRequest(BaseModel):
    """Form fields accompanying a recording upload from the call-agent UI.

    The audio file itself travels as multipart form data, not on this model.
    """

    call_agent_code: str
    customer_number: str | None = None
    customer_name: str | None = None
    occurred_at: datetime | None = None


class CallUploadResponse(BaseModel):
    call_id: str
    recording_id: str
    storage_path: str


class CallStatusResponse(BaseModel):
    """Polled by the call-agent UI while the pipeline runs in the background."""

    call_id: str
    status: str
    transcript: str | None = None
    outcome: CallAgentOutput | None = None
    # Populated only when status == "failed", so the agent sees *why* rather
    # than a bare failure, and can tell a retryable blip from a real problem.
    failed_stage: str | None = None
    error_message: str | None = None
