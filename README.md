# Friday — AI Call Agent Backend

Customers call in, an AI call agent handles the call, and the outcome is
recorded as a structured JSON contract in Supabase Postgres. See
`docs/architecture.md` for the source architecture and `docs/phase-plan.md`
for the build plan and progress.

## Stack

- **FastAPI** — HTTP layer (call-agent upload endpoint, reporting endpoints)
- **LangGraph** — intent-classification node, backed by `sarvam-105b`
- **Sarvam STT** (`saaras:v3`/`v4`) — audio-to-text ("Translator AI")
- **Pydantic** — structural enforcement of the call-agent output contract
- **Supabase** — Postgres (RLS-protected) + Storage (call recordings)

## Pipeline

A human call agent handles the call live, then uploads the recording via
`POST /api/calls/upload`. From there everything runs automatically, no
manual triggers in between:

```
upload -> call_tracking_process -> Translator AI (STT) -> intent
classification (LangGraph) -> OP validated JSON -> call_outcomes
```

`lead_classification` and `active_status` are Postgres views computed live
from `calls` / `call_outcomes` / `call_agents` — nothing to schedule. The
manager dashboard reads them via `GET /api/reports/leads` and
`GET /api/reports/active-status`; new call agents are onboarded via
`POST /api/agents`. **These reporting/agent endpoints are unauthenticated
today** — see `docs/phase-plan.md` for the open auth decision.

## Run the end-to-end demo

Proves the whole pipeline works without needing a Supabase project or Sarvam
credentials:

```bash
pip install -e ".[dev]"
python scripts/demo_pipeline.py
```

It provisions a real local Postgres database, applies every migration, and
drives the actual FastAPI app through: onboard an agent -> upload a recording
-> Translator AI -> intent classification -> validated OP JSON -> Postgres ->
derived views -> manager reporting endpoints -> a simulated failure and a
successful retry.

**Real** in that run: the SQL schema, its constraints, the views, the HTTP
routes, the background pipeline, storage I/O, and the retry path.
**Stubbed**: only the two Sarvam AI calls — set `SARVAM_API_KEY` and the demo
uses the real STT + `sarvam-105b` instead.

## Setup (against real Supabase)

```bash
pip install -e ".[dev]"
cp .env.example .env   # fill in Supabase + Sarvam credentials
uvicorn app.main:app --reload
```

Apply `db/migrations/*.sql` in filename order to your Supabase project first.

## Tests

```bash
pytest -q   # 61 tests, no credentials or network required
```

## Layout

```
app/
  main.py            FastAPI entrypoint
  core/               config, Supabase client
  models/schemas.py   Pydantic contracts (CallAgentOutput, CallUploadRequest/Response)
  api/routes/         HTTP route handlers
  services/           STT, intent classification, storage, call tracking, persistence
  workers/            call-handling job processing
db/
  migrations/         Postgres schema, storage bucket, and views (SQL, applied in order)
```
