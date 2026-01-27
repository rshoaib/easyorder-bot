-- Create the product-images bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public read access to product-images
create policy "Product images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Allow authenticated users to upload product images
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' );

-- Allow authenticated users to update product images
create policy "Authenticated users can update product images"
  on storage.objects for update
  using ( bucket_id = 'product-images' );
