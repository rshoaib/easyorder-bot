const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const migrationSQL = `
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
`;

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to database...');
    
    await client.query(migrationSQL);
    console.log('Migration executed successfully!');
    
  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    await client.end();
  }
}

migrate();
