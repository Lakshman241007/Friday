from app.core.supabase_client import get_supabase
from app.models.reporting import ActiveStatusRow, LeadClassificationRow

MAX_LIMIT = 200


def list_lead_classifications(
    call_agent_code: str | None = None,
    lead_classification: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[LeadClassificationRow]:
    """Phase 8: manager-dashboard read of the lead_classification view."""
    limit = min(limit, MAX_LIMIT)
    query = (
        get_supabase()
        .table("lead_classification")
        .select("*")
        .order("occurred_at", desc=True)
        .range(offset, offset + limit - 1)
    )
    if call_agent_code:
        query = query.eq("call_agent_code", call_agent_code)
    if lead_classification:
        query = query.eq("lead_classification", lead_classification)

    result = query.execute()
    return [LeadClassificationRow.model_validate(row) for row in result.data]


def list_active_status() -> list[ActiveStatusRow]:
    """Phase 8: manager-dashboard read of the active_status view."""
    result = get_supabase().table("active_status").select("*").order("call_agent_code").execute()
    return [ActiveStatusRow.model_validate(row) for row in result.data]
