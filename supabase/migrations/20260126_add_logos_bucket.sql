
-- Create the logos bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Allow public read access to logos
create policy "Logos are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'logos' );

-- Allow authenticated users to upload logos
create policy "Authenticated users can upload logos"
  on storage.objects for insert
  with check ( bucket_id = 'logos' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update logos
create policy "Authenticated users can update logos"
  on storage.objects for update
  using ( bucket_id = 'logos' AND auth.role() = 'authenticated' );
