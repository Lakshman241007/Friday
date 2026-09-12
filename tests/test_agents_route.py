from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.models.reporting import CallAgentOut
from app.services.agents import CallAgentCodeTaken

client = TestClient(app)


def test_create_agent_success():
    fake = CallAgentOut(
        id="agent-1", code="CA02", display_name="Agent Two", active=True,
        created_at="2026-08-21T00:00:00Z",
    )
    with patch("app.api.routes.agents.onboard_call_agent", return_value=fake):
        resp = client.post("/api/agents", json={"code": "CA02", "display_name": "Agent Two"})

    assert resp.status_code == 201
    assert resp.json()["code"] == "CA02"


def test_create_agent_duplicate_code_returns_409():
    with patch(
        "app.api.routes.agents.onboard_call_agent",
        side_effect=CallAgentCodeTaken("CA01"),
    ):
        resp = client.post("/api/agents", json={"code": "CA01"})

    assert resp.status_code == 409


def test_list_agents_success():
    fake = CallAgentOut(
        id="agent-1", code="CA01", display_name="Agent One", active=True,
        created_at="2026-08-21T00:00:00Z",
    )
    with patch("app.api.routes.agents.list_call_agents", return_value=[fake]):
        resp = client.get("/api/agents")

    assert resp.status_code == 200
    assert resp.json()[0]["code"] == "CA01"
