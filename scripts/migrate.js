
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:sh_riz5009_sh@db.ivhwrnpweubtodinsvvh.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const createTableCql = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  date TIMESTAMP DEFAULT NOW(),
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending'
);
`;

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to DB...');
    await client.query(createTableCql);
    console.log('Table "orders" created successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
