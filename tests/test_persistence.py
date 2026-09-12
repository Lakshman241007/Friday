from datetime import datetime, timezone
from unittest.mock import MagicMock, patch

from app.models.schemas import CallAgentOutput, CallStatus
from app.services.persistence import persist_call_outcome


def test_persist_call_outcome_success_no_time():
    supabase = MagicMock()
    table_mock = MagicMock()
    supabase.table.return_value = table_mock
    table_mock.insert.return_value = table_mock
    table_mock.execute.return_value = MagicMock()

    output = CallAgentOutput(status=CallStatus.success)
    with patch("app.services.persistence.get_supabase", return_value=supabase):
        persist_call_outcome("call-1", "agent-1", output)

    supabase.table.assert_called_once_with("call_outcomes")
    inserted = table_mock.insert.call_args.args[0]
    assert inserted["call_id"] == "call-1"
    assert inserted["call_agent_id"] == "agent-1"
    assert inserted["status"] == "success"
    assert inserted["follow_up_time"] is None
    assert inserted["raw_output"]["status"] == "success"


def test_persist_call_outcome_follow_up_includes_time():
    supabase = MagicMock()
    table_mock = MagicMock()
    supabase.table.return_value = table_mock
    table_mock.insert.return_value = table_mock
    table_mock.execute.return_value = MagicMock()

    when = datetime(2026, 8, 25, 10, 0, tzinfo=timezone.utc)
    output = CallAgentOutput(status=CallStatus.follow_up, time=when)
    with patch("app.services.persistence.get_supabase", return_value=supabase):
        persist_call_outcome("call-1", "agent-1", output)

    inserted = table_mock.insert.call_args.args[0]
    assert inserted["status"] == "follow-up"
    assert inserted["follow_up_time"] == when.isoformat()
