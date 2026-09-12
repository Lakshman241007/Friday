from app.core.supabase_client import get_supabase
from app.models.reporting import CallAgentCreate, CallAgentOut


class CallAgentCodeTaken(Exception):
    pass


def onboard_call_agent(request: CallAgentCreate) -> CallAgentOut:
    """Phase 8: DATA Onboarding - register a new call agent."""
    supabase = get_supabase()

    existing = (
        supabase.table("call_agents").select("id").eq("code", request.code).limit(1).execute()
    )
    if existing.data:
        raise CallAgentCodeTaken(request.code)

    result = (
        supabase.table("call_agents")
        .insert({"code": request.code, "display_name": request.display_name})
        .execute()
    )
    return CallAgentOut.model_validate(result.data[0])


def list_call_agents() -> list[CallAgentOut]:
    result = get_supabase().table("call_agents").select("*").order("code").execute()
    return [CallAgentOut.model_validate(row) for row in result.data]
