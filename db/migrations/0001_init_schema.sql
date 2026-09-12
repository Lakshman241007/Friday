-- Phase 1: core schema for the call-agent pipeline.
-- Run against Supabase Postgres (e.g. via `supabase db push` or the SQL editor).

create extension if not exists pgcrypto;

-- One row per AI call agent instance (diagram: "call agent id: CA01").
create table if not exists call_agents (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    display_name text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

-- One row per call, created when the call agent uploads the recording
-- through the call-agent UI (no telephony webhook in this flow).
create table if not exists calls (
    id uuid primary key default gen_random_uuid(),
    call_agent_id uuid not null references call_agents(id),
    customer_number text,
    customer_name text,
    occurred_at timestamptz not null default now(),
    status text not null default 'uploaded'
        check (status in ('uploaded', 'transcribed', 'classified', 'completed', 'failed')),
    created_at timestamptz not null default now()
);

-- Reconcile a `calls` table left over from the pre-redesign version of this
-- file (the Twilio-shaped one: call_sid / to_number / started_at, and no
-- customer_name). Because the CREATE above is IF NOT EXISTS, re-running this
-- file on such a database would otherwise be a silent no-op, and 0003 would
-- then fail on the missing customer_name column.
--
-- Every step below is guarded, so this whole block is a no-op on a database
-- that already has the current shape.
do $$
begin
    -- Columns the upload-based flow needs.
    alter table calls add column if not exists customer_name text;
    alter table calls add column if not exists occurred_at timestamptz not null default now();
    alter table calls add column if not exists created_at timestamptz not null default now();

    -- Preserve the old call-start timestamp as occurred_at before dropping it.
    if exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'calls' and column_name = 'started_at'
    ) then
        update calls set occurred_at = started_at;
        alter table calls drop column started_at;
    end if;

    -- Telephony-era columns with no meaning in the upload flow.
    alter table calls drop column if exists call_sid;
    alter table calls drop column if exists to_number;
    alter table calls drop column if exists ended_at;

    -- customer_number was NOT NULL when it came from the telephony payload;
    -- now it's optional metadata the uploading agent may omit.
    alter table calls alter column customer_number drop not null;

    -- Status vocabulary changed with the redesign. The old CHECK has to come
    -- off *before* the rows are remapped (it forbids the new values), and the
    -- new CHECK can only go on *after* (it forbids the old ones).
    alter table calls drop constraint if exists calls_status_check;
    update calls set status = 'uploaded' where status = 'in_progress';
    alter table calls add constraint calls_status_check
        check (status in ('uploaded', 'transcribed', 'classified', 'completed', 'failed'));
    alter table calls alter column status set default 'uploaded';

    -- Every call now belongs to the agent who uploaded it. Only tighten this
    -- if the existing data actually satisfies it, so the migration can't fail
    -- on legacy rows that predate the requirement.
    if not exists (select 1 from calls where call_agent_id is null) then
        alter table calls alter column call_agent_id set not null;
    else
        raise notice
            'calls.call_agent_id left nullable: % row(s) have no agent',
            (select count(*) from calls where call_agent_id is null);
    end if;
end $$;

create index if not exists calls_call_agent_id_idx on calls (call_agent_id);
create index if not exists calls_status_idx on calls (status);

-- One row per uploaded recording, linking Storage -> DB record
-- (diagram: "uploading voice recording" + "call tracking process").
-- transcript is filled in later by Translator AI (Phase 4).
create table if not exists recordings (
    id uuid primary key default gen_random_uuid(),
    call_id uuid not null references calls(id) on delete cascade,
    storage_path text not null,
    duration_seconds numeric,
    transcript text,
    uploaded_at timestamptz not null default now()
);

create index if not exists recordings_call_id_idx on recordings (call_id);

-- The validated "OP" output from intent classification: exactly the
-- 3-parameter contract from docs/architecture.md, one per call.
create table if not exists call_outcomes (
    id uuid primary key default gen_random_uuid(),
    call_id uuid not null unique references calls(id) on delete cascade,
    call_agent_id uuid references call_agents(id),
    status text not null check (status in ('success', 'reject', 'follow-up')),
    follow_up_time timestamptz,
    raw_output jsonb not null,
    created_at timestamptz not null default now(),
    constraint follow_up_time_matches_status check (
        (status = 'follow-up' and follow_up_time is not null)
        or (status <> 'follow-up' and follow_up_time is null)
    )
);

create index if not exists call_outcomes_call_agent_id_idx on call_outcomes (call_agent_id);
create index if not exists call_outcomes_status_idx on call_outcomes (status);

-- Row-Level Security: the backend writes via the Supabase service-role key
-- (which bypasses RLS); these policies scope what authenticated clients
-- (e.g. the manager dashboard) may read directly.
alter table call_agents enable row level security;
alter table calls enable row level security;
alter table recordings enable row level security;
alter table call_outcomes enable row level security;

drop policy if exists "authenticated read call_agents" on call_agents;
create policy "authenticated read call_agents" on call_agents
    for select to authenticated using (true);

drop policy if exists "authenticated read calls" on calls;
create policy "authenticated read calls" on calls
    for select to authenticated using (true);

drop policy if exists "authenticated read recordings" on recordings;
create policy "authenticated read recordings" on recordings
    for select to authenticated using (true);

drop policy if exists "authenticated read call_outcomes" on call_outcomes;
create policy "authenticated read call_outcomes" on call_outcomes
    for select to authenticated using (true);
