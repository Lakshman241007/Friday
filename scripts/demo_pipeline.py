#!/usr/bin/env python
"""End-to-end demo of the Friday call pipeline against a REAL Postgres database.

Runs the actual FastAPI app and the actual pipeline code - upload ->
call_tracking_process -> Translator AI -> intent classification -> OP JSON ->
Postgres -> derived views - with the Supabase client swapped for a real
Postgres connection and Supabase Storage swapped for a local directory.

The two Sarvam AI calls are stubbed unless SARVAM_API_KEY is set, because
they're the only part that needs a paid external service. Everything else -
the schema, the constraints, the views, the routes, the background pipeline,
the retry path - is the real thing.

Usage:
    python scripts/demo_pipeline.py

Requires a local Postgres reachable as the `postgres` superuser.
"""

from __future__ import annotations

import logging
import os
import subprocess
import sys
import time
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from unittest.mock import patch  # noqa: E402

from scripts.local_backends import PostgresBackend, reset_storage_dir  # noqa: E402

DB_NAME = "friday_demo"
# TCP + password, so the demo works when run as any OS user (peer auth on the
# unix socket only works when running as the `postgres` user itself).
DB_PASSWORD = os.environ.get("DEMO_PG_PASSWORD", "demo")
DSN = f"postgresql://postgres:{DB_PASSWORD}@127.0.0.1:5432/{DB_NAME}"
STORAGE_ROOT = Path("/tmp/friday-demo-storage")

MIGRATIONS = [
    "0001_init_schema.sql",
    "0002_storage_bucket.sql",
    "0003_lead_classification_view.sql",
    "0004_active_status_view.sql",
    "0005_pipeline_reliability.sql",
]

GREEN, YELLOW, RED, DIM, BOLD, RESET = (
    "\033[32m", "\033[33m", "\033[31m", "\033[2m", "\033[1m", "\033[0m",
)


def step(msg: str) -> None:
    print(f"\n{BOLD}=== {msg} ==={RESET}")


def ok(msg: str) -> None:
    print(f"  {GREEN}OK{RESET}  {msg}")


def info(msg: str) -> None:
    print(f"  {DIM}--{RESET}  {msg}")


def psql(sql: str, db: str = "postgres") -> None:
    subprocess.run(
        ["sudo", "-u", "postgres", "psql", "-d", db, "-v", "ON_ERROR_STOP=1", "-c", sql],
        check=True,
        capture_output=True,
    )


def setup_database() -> None:
    step("1. Provisioning a real Postgres database")
    subprocess.run(["service", "postgresql", "start"], capture_output=True)
    time.sleep(2)

    psql(f"ALTER USER postgres WITH PASSWORD '{DB_PASSWORD}';")
    psql(f"DROP DATABASE IF EXISTS {DB_NAME};")
    psql(f"CREATE DATABASE {DB_NAME};")
    ok(f"created database '{DB_NAME}'")

    # Supabase provides these roles and the storage schema; recreate the parts
    # the migrations reference so they apply unchanged.
    psql(
        "DO $$ BEGIN "
        "IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='authenticated') "
        "THEN CREATE ROLE authenticated; END IF; "
        "IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='service_role') "
        "THEN CREATE ROLE service_role; END IF; END $$;",
        db=DB_NAME,
    )
    psql(
        "CREATE SCHEMA IF NOT EXISTS storage; "
        "CREATE TABLE IF NOT EXISTS storage.buckets "
        "(id text primary key, name text, public boolean); "
        "CREATE TABLE IF NOT EXISTS storage.objects "
        "(id uuid primary key default gen_random_uuid(), bucket_id text, name text);",
        db=DB_NAME,
    )
    ok("recreated Supabase roles + storage schema")

    for migration in MIGRATIONS:
        path = REPO_ROOT / "db" / "migrations" / migration
        subprocess.run(
            ["sudo", "-u", "postgres", "psql", "-d", DB_NAME, "-v", "ON_ERROR_STOP=1",
             "-f", str(path)],
            check=True,
            capture_output=True,
        )
        ok(f"applied {migration}")


def build_fakes():
    """Stub the two Sarvam calls unless a real API key is configured."""
    use_real_ai = bool(os.environ.get("SARVAM_API_KEY"))
    if use_real_ai:
        info("SARVAM_API_KEY set - using the REAL Sarvam STT + sarvam-105b")
        return [], True

    from app.models.schemas import CallAgentOutput, CallStatus

    transcript = (
        "Hi Ravi, thanks for your time. -- Yes, the automation features look "
        "exactly like what our team needs. Please send the proposal and we'll "
        "review it internally next week."
    )

    def fake_transcribe(content, filename, content_type):
        time.sleep(0.4)
        return transcript

    def fake_classify(text):
        time.sleep(0.4)
        return CallAgentOutput(status=CallStatus.success)

    info("SARVAM_API_KEY not set - stubbing the two Sarvam calls")
    return [
        patch("app.services.call_tracking.transcribe_audio", side_effect=fake_transcribe),
        patch("app.services.call_tracking.classify_intent", side_effect=fake_classify),
    ], False


def main() -> int:
    setup_database()

    step("2. Wiring the app to real Postgres + local file storage")
    storage_root = reset_storage_dir(STORAGE_ROOT)
    backend = PostgresBackend(DSN, storage_root)
    ok(f"Postgres connected; storage at {storage_root}")

    ai_patches, using_real_ai = build_fakes()

    db_patches = [
        patch("app.services.call_tracking.get_supabase", return_value=backend),
        patch("app.services.storage.get_supabase", return_value=backend),
        patch("app.services.persistence.get_supabase", return_value=backend),
        patch("app.services.agents.get_supabase", return_value=backend),
        patch("app.services.reporting.get_supabase", return_value=backend),
    ]
    for p in db_patches + ai_patches:
        p.start()

    from fastapi.testclient import TestClient  # noqa: E402
    from app.main import app  # noqa: E402

    client = TestClient(app)

    try:
        step("3. Onboarding a call agent (POST /api/agents)")
        resp = client.post("/api/agents", json={"code": "CA01", "display_name": "Priya Sharma"})
        assert resp.status_code == 201, resp.text
        ok(f"created call agent CA01 -> {resp.json()['id']}")

        step("4. Employee uploads a recording (POST /api/calls/upload)")
        audio = b"RIFF....fake-wav-payload-for-the-demo"
        resp = client.post(
            "/api/calls/upload",
            data={
                "call_agent_code": "CA01",
                "customer_name": "Ravi Kumar",
                "customer_number": "+919876500000",
            },
            files={"file": ("call.wav", audio, "audio/wav")},
        )
        assert resp.status_code == 200, resp.text
        upload = resp.json()
        call_id = upload["call_id"]
        ok(f"call_id      {call_id}")
        ok(f"recording_id {upload['recording_id']}")
        ok(f"storage_path {upload['storage_path']}")

        stored = (storage_root / upload["storage_path"]).read_bytes()
        assert stored == audio
        ok(f"audio verified in storage ({len(stored)} bytes, byte-identical)")

        step("5. Pipeline result (Translator AI -> intent classification -> OP)")
        info("the background pipeline ran on the upload request")
        status = client.get(f"/api/calls/{call_id}").json()
        print(f"  status     {BOLD}{status['status']}{RESET}")
        print(f"  transcript {DIM}{(status['transcript'] or '')[:70]}...{RESET}")
        print(f"  outcome    {BOLD}{status['outcome']}{RESET}")
        assert status["status"] == "completed", status
        ok("call reached 'completed'")

        step("6. Verifying what actually landed in Postgres")
        rows = backend.sql(
            "SELECT c.status, c.attempts, co.status AS outcome, co.raw_output, "
            "r.transcript IS NOT NULL AS has_transcript "
            "FROM calls c "
            "JOIN call_outcomes co ON co.call_id = c.id "
            "JOIN recordings r ON r.call_id = c.id"
        )
        for row in rows:
            print(f"  {row}")
        assert rows and rows[0]["outcome"] == "success"
        ok("call_outcomes row written with the validated 3-parameter contract")

        step("7. Derived views (lead classification / active status)")
        for row in backend.sql(
            "SELECT call_agent_code, customer_name, outcome_status, lead_classification "
            "FROM lead_classification"
        ):
            print(f"  lead_classification  {row}")
        for row in backend.sql(
            "SELECT call_agent_code, active, calls_last_24h, calls_total FROM active_status"
        ):
            print(f"  active_status        {row}")
        ok("views compute from the stored call automatically")

        step("8. Manager dashboard reads (GET /api/reports/*)")
        leads = client.get("/api/reports/leads").json()
        active = client.get("/api/reports/active-status").json()
        print(f"  /api/reports/leads          -> {len(leads)} row(s): {leads[0]['lead_classification']}")
        print(f"  /api/reports/active-status  -> {len(active)} row(s): "
              f"{active[0]['calls_total']} call(s) total")
        ok("reporting API serves the manager dashboard from real data")

        step("9. Failure + retry recovery")
        from app.services.intent_classification import IntentClassificationError

        # The pipeline logs a full traceback for this deliberately-induced
        # failure; quiet it so the demo output stays readable.
        logging.getLogger("app.services.call_tracking").setLevel(logging.CRITICAL)

        # Simulate the classifier being down while this call is uploaded, so
        # its very first pipeline run fails at the classification stage.
        with patch(
            "app.services.call_tracking.classify_intent",
            side_effect=IntentClassificationError("simulated model outage"),
        ):
            resp = client.post(
                "/api/calls/upload",
                data={"call_agent_code": "CA01", "customer_name": "Anita Sharma"},
                files={"file": ("call2.wav", b"RIFF....second-call", "audio/wav")},
            )
            call2 = resp.json()["call_id"]

        failed = client.get(f"/api/calls/{call2}").json()
        print(f"  after failure: status={RED}{failed['status']}{RESET} "
              f"stage={failed['failed_stage']} reason={failed['error_message'][:40]}...")
        assert failed["status"] == "failed"
        ok("failure recorded with the reason, not a bare 'failed'")

        with patch("app.services.call_tracking.transcribe_audio") as retranscribe:
            client.post(f"/api/calls/{call2}/retry")
            recovered = client.get(f"/api/calls/{call2}").json()
            assert not retranscribe.called, "retry should not re-transcribe"
        print(f"  after retry:   status={GREEN}{recovered['status']}{RESET} "
              f"outcome={recovered['outcome']}")
        assert recovered["status"] == "completed"
        ok("retry recovered the call WITHOUT re-transcribing or re-uploading")

        step("RESULT")
        print(f"  {GREEN}{BOLD}Full pipeline verified end-to-end against real Postgres.{RESET}")
        print(f"  {DIM}Real: schema, constraints, views, routes, pipeline, retry, storage I/O{RESET}")
        if not using_real_ai:
            print(f"  {YELLOW}Stubbed: the 2 Sarvam AI calls (set SARVAM_API_KEY to use the real ones){RESET}")
        return 0

    finally:
        for p in db_patches + ai_patches:
            p.stop()
        backend.close()


if __name__ == "__main__":
    sys.exit(main())
