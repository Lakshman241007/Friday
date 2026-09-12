from datetime import datetime

from pydantic import BaseModel


class LeadClassificationRow(BaseModel):
    call_id: str
    call_agent_id: str | None
    call_agent_code: str | None
    customer_number: str | None
    customer_name: str | None
    occurred_at: datetime
    outcome_status: str | None
    lead_classification: str
    follow_up_time: datetime | None
    classified_at: datetime | None


class ActiveStatusRow(BaseModel):
    call_agent_id: str
    call_agent_code: str
    display_name: str | None
    active: bool
    calls_last_24h: int
    calls_total: int
    last_call_at: datetime | None


class CallAgentCreate(BaseModel):
    code: str
    display_name: str | None = None


class CallAgentOut(BaseModel):
    id: str
    code: str
    display_name: str | None
    active: bool
    created_at: datetime
