const fs = require('fs');
const path = require('path');
const https = require('https');

// Load env vars manually since we might not have dotenv installed in devDependencies
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const ACCESS_TOKEN = env['WHATSAPP_ACCESS_TOKEN'];
const PHONE_NUMBER_ID = env['WHATSAPP_PHONE_NUMBER_ID'];

console.log('Testing Credentials...');
console.log(`Phone ID: ${PHONE_NUMBER_ID}`);
console.log(`Access Token: ${ACCESS_TOKEN ? ACCESS_TOKEN.substring(0, 10) + '...' : 'MISSING'}`);

if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.error('ERROR: Missing credentials in .env.local');
    process.exit(1);
}

const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: "15555555555", // Dummy number
    text: { body: "Credential Test" }
});

const options = {
    hostname: 'graph.facebook.com',
    path: `/v18.0/${PHONE_NUMBER_ID}/messages`,
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`API Status Code: ${res.statusCode}`);
    
    let responseBody = '';
    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        const body = JSON.parse(responseBody);
        if (res.statusCode === 200) {
            console.log('SUCCESS: Credentials are valid!');
        } else if (res.statusCode === 401) {
             console.error('FAILURE: Invalid Access Token (401).');
             console.error('Please generate a new System User access token in Meta Business Settings.');
        } else if (res.statusCode === 400) {
            // we expect a 400 because of the dummy number, but if we get here, Auth worked!
            if (body.error && body.error.message && body.error.message.includes('recipient phone number')) {
                 console.log('SUCCESS: Credentials are valid! (Request failed on phone number as expected).');
            } else {
                 console.log('WARNING: Auth seems okay, but other error occurred:');
                 console.log(JSON.stringify(body, null, 2));
            }
        } else {
            console.log('UNKNOWN RESPONSE:');
            console.log(JSON.stringify(body, null, 2));
        }
    });
});

req.on('error', (error) => {
    console.error('Network Error:', error);
});

req.write(data);
req.end();
