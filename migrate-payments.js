const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

console.log('Starting payment methods migration...');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to database!');

    await client.query('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS paypal_link TEXT');
    console.log('Added paypal_link column.');

    await client.query('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS stripe_link TEXT');
    console.log('Added stripe_link column.');

    await client.query('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS cod_enabled BOOLEAN DEFAULT true');
    console.log('Added cod_enabled column.');

    console.log('Payment methods migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
