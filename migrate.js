const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

console.log('Connecting to:', process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected!');
    
    const sql = `
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'restaurant';
    `;
    
    const res = await client.query(sql);
    console.log('Migration executed successfully:', res);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
