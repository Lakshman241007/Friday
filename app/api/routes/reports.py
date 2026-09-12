from fastapi import APIRouter, Query

from app.models.reporting import ActiveStatusRow, LeadClassificationRow
from app.services.reporting import list_active_status, list_lead_classifications

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/leads", response_model=list[LeadClassificationRow])
def get_leads(
    call_agent_code: str | None = None,
    lead_classification: str | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> list[LeadClassificationRow]:
    return list_lead_classifications(
        call_agent_code=call_agent_code,
        lead_classification=lead_classification,
        limit=limit,
        offset=offset,
    )


@router.get("/active-status", response_model=list[ActiveStatusRow])
def get_active_status() -> list[ActiveStatusRow]:
    return list_active_status()
