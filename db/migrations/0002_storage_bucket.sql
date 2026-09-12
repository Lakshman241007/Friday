-- Phase 1: Storage bucket for raw call audio ("uploading voice recording").
-- Private bucket: the backend uploads via the service-role key and issues
-- signed URLs when the dashboard needs to play a recording back.

insert into storage.buckets (id, name, public)
values ('call-recordings', 'call-recordings', false)
on conflict (id) do nothing;

drop policy if exists "service role manages call-recordings" on storage.objects;
create policy "service role manages call-recordings"
    on storage.objects for all
    to service_role
    using (bucket_id = 'call-recordings')
    with check (bucket_id = 'call-recordings');
