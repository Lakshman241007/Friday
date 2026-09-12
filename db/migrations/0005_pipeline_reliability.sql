-- Pipeline reliability: record *why* a call failed and how many times the
-- pipeline has run for it, so the call-agent UI can show a real reason
-- instead of a bare "failed", and so a stuck/failed call can be retried
-- without re-uploading the recording.

alter table calls
    add column if not exists failed_stage text
        check (failed_stage is null or failed_stage in ('transcription', 'classification')),
    add column if not exists error_message text,
    add column if not exists attempts integer not null default 0;

-- Lets the retry path find calls that never reached a terminal state (e.g.
-- the process died mid-pipeline, since background work runs in-process).
create index if not exists calls_unfinished_idx
    on calls (status)
    where status in ('uploaded', 'transcribed', 'failed');
