const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

console.log('Starting migration...');

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
    console.log('Host:', client.connectionParameters.host);
    
    // 1. Tenants Migration
    const tenantsSql = `
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'restaurant';
    `;
    await client.query(tenantsSql);
    console.log('Tenants migration executed.');

    // 2. Products Migration
    const productsSql = `
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS type text DEFAULT 'physical';
    `;
    await client.query(productsSql);
    console.log('Products migration executed.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
