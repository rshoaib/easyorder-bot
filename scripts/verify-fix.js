const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Manually parse .env.local to get DATABASE_URL
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
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

async function verify() {
  try {
    await client.connect();
    console.log('Connected to database...');
    
    // Check if bucket exists
    const res = await client.query("select * from storage.buckets where id = 'product-images'");
    if (res.rows.length > 0) {
        console.log("✅ SUCCESS: 'product-images' bucket found.");
        console.log("Details:", res.rows[0]);
    } else {
        console.error("❌ FAILURE: 'product-images' bucket NOT found.");
    }
    
  } catch (err) {
    console.error('Error executing verification:', err);
  } finally {
    await client.end();
  }
}

verify();
