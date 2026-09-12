from app.core.supabase_client import get_supabase
from app.models.schemas import CallAgentOutput


def persist_call_outcome(call_id: str, call_agent_id: str, output: CallAgentOutput) -> None:
    """Phase 6: write the validated OP JSON to call_outcomes, tied to call_agent_id."""
    supabase = get_supabase()
    supabase.table("call_outcomes").insert(
        {
            "call_id": call_id,
            "call_agent_id": call_agent_id,
            "status": output.status.value,
            "follow_up_time": output.time.isoformat() if output.time else None,
            "raw_output": output.model_dump(mode="json"),
        }
    ).execute()
