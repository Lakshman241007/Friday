from unittest.mock import MagicMock, patch

import pytest

from app.models.reporting import CallAgentCreate
from app.services.agents import CallAgentCodeTaken, list_call_agents, onboard_call_agent


def test_onboard_call_agent_success():
    supabase, table_mock = MagicMock(), MagicMock()
    supabase.table.return_value = table_mock
    table_mock.select.return_value = table_mock
    table_mock.eq.return_value = table_mock
    table_mock.limit.return_value = table_mock
    table_mock.insert.return_value = table_mock

    # first execute() call is the existence check, second is the insert
    table_mock.execute.side_effect = [
        MagicMock(data=[]),
        MagicMock(
            data=[
                {
                    "id": "agent-1",
                    "code": "CA02",
                    "display_name": "Agent Two",
                    "active": True,
                    "created_at": "2026-08-21T00:00:00Z",
                }
            ]
        ),
    ]

    with patch("app.services.agents.get_supabase", return_value=supabase):
        result = onboard_call_agent(CallAgentCreate(code="CA02", display_name="Agent Two"))

    assert result.code == "CA02"
    table_mock.insert.assert_called_once_with({"code": "CA02", "display_name": "Agent Two"})


def test_onboard_call_agent_duplicate_code_raises():
    supabase, table_mock = MagicMock(), MagicMock()
    supabase.table.return_value = table_mock
    table_mock.select.return_value = table_mock
    table_mock.eq.return_value = table_mock
    table_mock.limit.return_value = table_mock
    table_mock.execute.return_value = MagicMock(data=[{"id": "agent-1"}])

    with patch("app.services.agents.get_supabase", return_value=supabase):
        with pytest.raises(CallAgentCodeTaken):
            onboard_call_agent(CallAgentCreate(code="CA01"))


def test_list_call_agents():
    supabase, table_mock = MagicMock(), MagicMock()
    supabase.table.return_value = table_mock
    table_mock.select.return_value = table_mock
    table_mock.order.return_value = table_mock
    table_mock.execute.return_value = MagicMock(
        data=[
            {
                "id": "agent-1",
                "code": "CA01",
                "display_name": "Agent One",
                "active": True,
                "created_at": "2026-08-21T00:00:00Z",
            }
        ]
    )

    with patch("app.services.agents.get_supabase", return_value=supabase):
        results = list_call_agents()

    assert len(results) == 1
    assert results[0].code == "CA01"
