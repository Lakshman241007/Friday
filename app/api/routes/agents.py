from fastapi import APIRouter, HTTPException

from app.models.reporting import CallAgentCreate, CallAgentOut
from app.services.agents import CallAgentCodeTaken, list_call_agents, onboard_call_agent

router = APIRouter(prefix="/api/agents", tags=["agents"])


@router.post("", response_model=CallAgentOut, status_code=201)
def create_agent(request: CallAgentCreate) -> CallAgentOut:
    try:
        return onboard_call_agent(request)
    except CallAgentCodeTaken as exc:
        raise HTTPException(
            status_code=409, detail=f"Call agent code already in use: {exc}"
        ) from exc


@router.get("", response_model=list[CallAgentOut])
def get_agents() -> list[CallAgentOut]:
    return list_call_agents()
