from unittest.mock import MagicMock, patch

from app.services.reporting import list_active_status, list_lead_classifications


def _mock_query_chain(supabase, table_mock, data):
    supabase.table.return_value = table_mock
    table_mock.select.return_value = table_mock
    table_mock.order.return_value = table_mock
    table_mock.range.return_value = table_mock
    table_mock.eq.return_value = table_mock
    table_mock.execute.return_value = MagicMock(data=data)


def test_list_lead_classifications_maps_rows():
    supabase, table_mock = MagicMock(), MagicMock()
    row = {
        "call_id": "call-1",
        "call_agent_id": "agent-1",
        "call_agent_code": "CA01",
        "customer_number": "+15550001111",
        "customer_name": "Alice",
        "occurred_at": "2026-08-21T10:00:00Z",
        "outcome_status": "follow-up",
        "lead_classification": "warm",
        "follow_up_time": "2026-08-25T10:00:00Z",
        "classified_at": "2026-08-21T10:05:00Z",
    }
    _mock_query_chain(supabase, table_mock, [row])

    with patch("app.services.reporting.get_supabase", return_value=supabase):
        results = list_lead_classifications(call_agent_code="CA01")

    supabase.table.assert_called_once_with("lead_classification")
    table_mock.eq.assert_called_once_with("call_agent_code", "CA01")
    assert len(results) == 1
    assert results[0].lead_classification == "warm"


def test_list_lead_classifications_caps_limit():
    supabase, table_mock = MagicMock(), MagicMock()
    _mock_query_chain(supabase, table_mock, [])

    with patch("app.services.reporting.get_supabase", return_value=supabase):
        list_lead_classifications(limit=10_000)

    table_mock.range.assert_called_once_with(0, 199)


def test_list_active_status_maps_rows():
    supabase, table_mock = MagicMock(), MagicMock()
    row = {
        "call_agent_id": "agent-1",
        "call_agent_code": "CA01",
        "display_name": "Agent One",
        "active": True,
        "calls_last_24h": 3,
        "calls_total": 10,
        "last_call_at": "2026-08-21T09:00:00Z",
    }
    supabase.table.return_value = table_mock
    table_mock.select.return_value = table_mock
    table_mock.order.return_value = table_mock
    table_mock.execute.return_value = MagicMock(data=[row])

    with patch("app.services.reporting.get_supabase", return_value=supabase):
        results = list_active_status()

    supabase.table.assert_called_once_with("active_status")
    assert results[0].calls_last_24h == 3
