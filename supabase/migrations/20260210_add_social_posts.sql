create table if not exists social_posts (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references tenants(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  provider text not null check (provider in ('facebook', 'instagram')),
  external_post_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table social_posts enable row level security;

-- Policy: Tenants can view their own posts
create policy "Tenants can view their own social posts"
  on social_posts for select
  using (auth.uid() in (
    select user_id from tenants where id = social_posts.tenant_id
  ));

-- Policy: Tenants can insert their own posts (via server action)
create policy "Tenants can insert their own social posts"
  on social_posts for insert
  with check (auth.uid() in (
    select user_id from tenants where id = social_posts.tenant_id
  ));
