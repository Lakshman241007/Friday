# Development Phase Plan

Derived from `docs/architecture.md`. Stack: Python, FastAPI, LangGraph, Pydantic,
Supabase (Postgres + Storage).

- [x] **Phase 0 — Scaffold**: repo structure, dependency management, config/env
  handling, FastAPI app skeleton, Supabase client wrapper.
- [x] **Phase 1 — Data layer**: Postgres schema (`call_agents`, `calls`,
  `recordings`, `call_outcomes`), RLS policies, Storage bucket for audio.
- [x] **Phase 2 — Call-agent upload endpoint**: `POST /api/calls/upload`
  (multipart: `call_agent_code` + customer info + audio file). No telephony
  webhook — the human call agent handles the call live and uploads the
  recording afterward through the call-agent UI.
- [x] **Phase 3 — `call_tracking_process`**: service that resolves the call
  agent, creates the `calls` row, uploads audio to Supabase Storage, and
  creates the `recordings` row linking `storage_path` <-> `call_id` — merged
  into the Phase 2 endpoint since upload *is* the trigger for tracking.
- [x] **Phase 4 — Translator AI**: Sarvam STT wrapper (`saaras:v3`/`v4`),
  fired automatically as a background task the moment a recording is
  uploaded (no separate trigger/poll needed).
- [x] **Phase 5 — Intent classification**: LangGraph node (`sarvam-105b`) +
  system prompt, Pydantic schema enforcing the 3-field contract (`status`:
  success/reject/follow-up, `time`). Chained automatically off a successful
  transcription — same continuous flow as the diagram.
- [x] **Phase 6 — Persistence (OP)**: validated JSON write to `call_outcomes`,
  tied to `call_agent_id`; `calls.status` moves to `completed`.
- [x] **Phase 7 — Derived views**: `lead_classification` / `active_status` as
  Postgres views, `security_invoker = true` so the RLS policies on the
  underlying tables are enforced for whoever queries the view, not bypassed
  via the view owner's privileges.
- [x] **Phase 8 — Reporting API**: `GET /api/reports/leads` (filterable,
  paginated), `GET /api/reports/active-status` for the manager dashboard;
  `POST /api/agents` / `GET /api/agents` for call-agent onboarding.
- [ ] **Phase 9 — Tests + deploy**: unit tests for the Pydantic contract and
  LangGraph node, integration test for the call pipeline, deployment notes.
  (35 tests passing as of Phase 8; still need one true end-to-end
  integration test and deploy notes.)

## Frontend status

**Started** (`frontend/`: Vite + React + TypeScript + Tailwind CSS v4).

- [x] `/` — Home / landing page.
- [x] `/login` — manager login. **Hardcoded demo credentials only**
  (`demo@gmail.com` / `democall`, see `frontend/src/lib/auth.ts`) - not a
  real auth backend, just a client-side gate.
- [x] `/dashboard` — protected route (client-side session check only).
  Overview UI built to spec: stat cards, employee performance chart
  (recharts), Friday AI insights panel, recent call activity table, team
  activity, attention-required panel.
- [x] `/dashboard/leads` — Lead Management UI built to spec: lead stats,
  pipeline distribution, searchable/filterable leads table, AI insights
  sidebar.
- [x] `/dashboard/calls` — Call Monitoring UI built to spec: live calls
  table with AI signal badges, live AI-intelligence event feed, recently
  completed calls table.
- [x] `/dashboard/calls/:callId` — Call Details UI built to spec: AI
  summary + key recommendation, detected signals grid, conversation
  analysis (talk time / questions / objections / signals), AI call score
  breakdown, sentiment-arc chart with a concern annotation, and an
  annotated transcript (AI-signal/objection phrase highlighting). Mock
  records for 3 calls (C-1024, C-1023, C-1022); unknown ids render a
  "not found" state instead of fabricated data.
- [x] `/dashboard/follow-ups` — Follow-ups UI built to spec: stats strip
  (total/due-today/overdue/completed/high-priority), a searchable and
  tab-filterable follow-ups table, a Timeline sidebar (today's schedule,
  a Friday AI insight callout, an attention-required overdue list).
- [x] `/dashboard/performance` — lightweight placeholder page so the
  sidebar nav doesn't 404; not designed yet. **Alerts and Reports were
  removed from the sidebar and routing entirely** (no design exists for
  them, and none was requested) rather than left as placeholders.
- [x] `/employee` — **Employee Dashboard, mobile UI only**, built to spec:
  top bar, AI-online pill, horizontally scrolling stat-card carousel,
  Weekly Activity bar chart (current day highlighted), a Friday Insights
  callout, an Active Leads list, and a sticky bottom Quick Call / Review
  bar. A separate persona from the manager dashboard - own top-level
  route, own chrome (no sidebar), own mock data
  (`frontend/src/employee/mockData.ts`), and **no login gate at all** -
  there's no employee-auth flow, unlike the manager's hardcoded one.
  Deliberately mobile-only per what was asked: full-width on a real
  mobile viewport, a fixed-height phone-frame mockup with internal
  scroll on wider screens, not a responsive desktop layout.
- [ ] **All dashboard data is static mock data**
  (`frontend/src/dashboard/mockData.ts`, `callMonitoringData.ts`,
  `callDetailData.ts`, `followUpsData.ts`, `employee/mockData.ts`) -
  deliberately not wired to the backend per this round of work. Wiring
  Overview/Lead Management to the real Phase 8 endpoints
  (`GET /api/reports/leads`, `GET /api/reports/active-status`,
  `POST/GET /api/agents`) is next; mock shapes mirror those responses so
  it's a data-layer swap, not a UI rewrite. Call Monitoring, Call Details,
  Follow-ups, and the Employee Dashboard have **no backend endpoint at all
  yet** - that's new scope beyond Phase 8, not just an unwired UI.
- [ ] Call-agent upload UI (`POST /api/calls/upload`) - not started.
- [ ] Real auth (see the open decision below) - the hardcoded login must be
  replaced before this goes anywhere near production.

Note: `/api/reports/*`, `/api/agents`, and `/api/calls/upload` are currently
**unauthenticated on the backend** - see the open auth decision below. Do
not expose them publicly before that's resolved.

## Decisions made while scaffolding

- **No Twilio / telephony webhook.** The call itself happens outside this
  system — a human call agent is on the line, then uploads the recording
  through the call-agent UI. `calls` is created at upload time, not at
  call-start, so it has no `call_sid`; `call_agent_id`, `customer_number`,
  `customer_name`, and `occurred_at` are supplied by the uploading agent.
- **Views over cron** for `lead_classification` / `active_status` in Phase 7:
  simpler, always-fresh, no scheduler to operate. Revisit if computation
  becomes too heavy for a live view.
- **`call_tracking_process` responsibility** (Phase 3): a table row created at
  upload time that links a `recordings` row to its parent `calls` row by
  `call_id`, so a recording is always traceable to its call even before
  transcription/classification finish.
- Auth/permissions model for the manager dashboard is still open. Phase 8's
  reporting/agent endpoints were built without it so the rest of the pipeline
  wasn't blocked, but they must not go to production unauthenticated -
  Supabase Auth + RLS roles is the likely default; needs a decision.
