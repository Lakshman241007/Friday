-- Phase 7: lead_classification view.
-- Derives a lead-status label per call from its outcome, so downstream
-- consumers (manager dashboard) don't recompute the mapping themselves.
--
-- Mapping (see docs/architecture.md "Data Contract"):
--   success    -> 'converted'
--   follow-up  -> 'warm'     (pending follow-up; follow_up_time is set)
--   reject     -> 'cold'
--   no outcome yet (still uploaded/transcribed/failed) -> 'pending'
--
-- security_invoker = true (PG15+) makes the view run with the *querying*
-- role's privileges rather than the view owner's, so the RLS policies on
-- calls/call_outcomes/call_agents (Phase 1) are actually enforced for
-- whoever queries this view - not silently bypassed because a superuser
-- created it.

create or replace view lead_classification
with (security_invoker = true) as
select
    c.id as call_id,
    c.call_agent_id,
    ca.code as call_agent_code,
    c.customer_number,
    c.customer_name,
    c.occurred_at,
    co.status as outcome_status,
    case co.status
        when 'success' then 'converted'
        when 'follow-up' then 'warm'
        when 'reject' then 'cold'
        else 'pending'
    end as lead_classification,
    co.follow_up_time,
    co.created_at as classified_at
from calls c
left join call_outcomes co on co.call_id = c.id
left join call_agents ca on ca.id = c.call_agent_id;

grant select on lead_classification to authenticated;
