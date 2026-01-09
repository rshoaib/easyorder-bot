const run = async () => {
    const payload = {
        object: "whatsapp_business_account",
        entry: [
            {
                changes: [
                    {
                        value: {
                            messages: [
                                {
                                    from: "15550257322",
                                    text: { body: "menu" }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    };

    const url = 'https://orderviachat.com/webhook';
    console.log(`Sending simulated WhatsApp message to ${url}...`);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Body: ${text}`);
    } catch (e) {
        console.error('Error:', e);
    }
};

run();
