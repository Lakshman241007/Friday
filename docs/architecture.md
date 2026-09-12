# Backend Architecture V1

Source diagram: `backend architecure V1 .png` (Miro export).

## Overview

Customers place calls that are handled by AI call agents. Each call is recorded,
transcribed, classified, and written to the database as a structured JSON record.
Downstream, the data feeds lead classification / active-status views and a
manager dashboard for onboarding and reporting.

## Component Mapping

| Diagram Node | Component / Responsibility |
|---|---|
| `customer` → `call agent` | Twilio (or similar telephony) webhook hits the backend `/api` route, which enqueues a call-handling job |
| `uploading voice recording` | Call audio is stored as blobs in Supabase Storage |
| `Translator AI` | Sarvam STT (`saaras:v3` default / `saaras:v4` latest) converts customer audio to text; runs inside the call-agent worker |
| `Intent classification` + `system prompt` | LangGraph node inside the call-agent worker (model: `sarvam-105b`, flagship). Takes the transcribed text, reasons over it with the system prompt, and produces structured output enforced via a Pydantic schema |
| `OP` | The validated JSON output (the 3-parameter contract) is written to Supabase Postgres |
| `DATA BASE` | Supabase Postgres, protected by Row-Level Security (RLS) |
| `lead classification` / `Active status` | Postgres views (or a lightweight cron job) derived from the stored call records |
| `call tracking process` | Links uploaded recordings to their DB records for traceability |
| `DATA Onboarding` / `manager dashboard` | Front-end / reporting layer reading from Postgres for account onboarding and manager-facing analytics |

## Call Flow

1. **Inbound call** — Customer calls in; telephony webhook forwards the call to an available call-agent instance via `/api`.
2. **Recording** — Audio is captured and uploaded to Supabase Storage (`uploading voice recording`).
3. **Transcription** — Translator AI (Sarvam STT) converts the stored audio into text.
4. **Intent classification** — A LangGraph node in the call-agent worker takes the transcript, applies the system prompt, and reasons about intent.
5. **Structured output (OP)** — Output is enforced as JSON with exactly three parameters:
   - `success`
   - `reject`
   - `follow-up → time` (for follow-up cases)
6. **Persistence** — The validated JSON is written to Supabase Postgres (RLS-protected).
7. **Derived views** — Lead classification and active-status are computed from the DB, either via Postgres views or a scheduled cron job.
8. **Reporting** — Manager dashboard and onboarding tooling read from Postgres to surface call outcomes and lead status.

## Data Contract (Call Agent Output)

Every call-agent invocation must emit JSON with only these three parameters:

```json
{
  "status": "success | reject | follow-up",
  "time": "ISO 8601 timestamp (required when status = follow-up)"
}
```

This contract is enforced structurally via a Pydantic model in the LangGraph
intent-classification node — no other fields are permitted.

## Models in Use

| Purpose | Model ID |
|---|---|
| Speech-to-text (Translator AI) | `saaras:v3` (default, recommended) / `saaras:v4` (latest) |
| Intent classification / reasoning | `sarvam-105b` (flagship) |

## Data Stores

- **Supabase Storage** — raw call audio blobs.
- **Supabase Postgres (RLS-protected)** — structured call outcomes, call-agent identifiers (e.g. `call agent id: CA01`), lead classification, active status.

## Open Questions / Gaps in V1

- Exact trigger mechanism for `lead classification` / `Active status` (view vs. cron) is not finalized in the diagram — needs a decision.
- `call tracking process` box's exact responsibility (linking storage → DB record) should be confirmed with the team.
- Auth/permissions model for the manager dashboard and onboarding flow is not detailed here.
