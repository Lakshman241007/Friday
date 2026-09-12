from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.models.reporting import ActiveStatusRow, LeadClassificationRow

client = TestClient(app)


def test_get_leads_success():
    row = LeadClassificationRow(
        call_id="call-1",
        call_agent_id="agent-1",
        call_agent_code="CA01",
        customer_number="+15550001111",
        customer_name="Alice",
        occurred_at="2026-08-21T10:00:00Z",
        outcome_status="follow-up",
        lead_classification="warm",
        follow_up_time="2026-08-25T10:00:00Z",
        classified_at="2026-08-21T10:05:00Z",
    )
    with patch("app.api.routes.reports.list_lead_classifications", return_value=[row]):
        resp = client.get("/api/reports/leads", params={"call_agent_code": "CA01"})

    assert resp.status_code == 200
    assert resp.json()[0]["lead_classification"] == "warm"


def test_get_leads_limit_validation():
    resp = client.get("/api/reports/leads", params={"limit": 9999})
    assert resp.status_code == 422


def test_get_active_status_success():
    row = ActiveStatusRow(
        call_agent_id="agent-1",
        call_agent_code="CA01",
        display_name="Agent One",
        active=True,
        calls_last_24h=3,
        calls_total=10,
        last_call_at="2026-08-21T09:00:00Z",
    )
    with patch("app.api.routes.reports.list_active_status", return_value=[row]):
        resp = client.get("/api/reports/active-status")

    assert resp.status_code == 200
    assert resp.json()[0]["calls_total"] == 10
