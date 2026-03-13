const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function compare() {
    const db = new SupabaseREST();
    const data = await db.select('blog_posts', 'slug,content');

    const reference = data.find(p => p.slug === 'free-online-ordering-systems-compared');
    const target = data.find(p => p.slug === 'whatsapp-ai-chatbot-ordering');

    fs.writeFileSync('/tmp/reference_content.html', reference ? reference.content : 'NOT FOUND');
    fs.writeFileSync('/tmp/target_content.html', target ? target.content : 'NOT FOUND');
    
    console.log('Reference content length:', reference ? reference.content.length : 0);
    console.log('Target content length:', target ? target.content.length : 0);
    console.log('Files written to /tmp/reference_content.html and /tmp/target_content.html');
}

compare();
