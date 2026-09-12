-- Phase 7: active_status view.
-- Per-call-agent operational snapshot: whether the agent is marked active
-- plus recent activity counts, so the dashboard doesn't have to aggregate
-- calls/recordings itself on every read.
--
-- security_invoker = true, same reasoning as lead_classification.

create or replace view active_status
with (security_invoker = true) as
select
    ca.id as call_agent_id,
    ca.code as call_agent_code,
    ca.display_name,
    ca.active,
    count(c.id) filter (
        where c.occurred_at >= now() - interval '24 hours'
    ) as calls_last_24h,
    count(c.id) as calls_total,
    max(c.occurred_at) as last_call_at
from call_agents ca
left join calls c on c.call_agent_id = ca.id
group by ca.id, ca.code, ca.display_name, ca.active;

grant select on active_status to authenticated;
