const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const migrationSQL = `
-- Add missing columns for social media and settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS meta_pixel_id TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS owner_phone TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS custom_domain TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
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
