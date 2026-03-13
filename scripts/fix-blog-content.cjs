/**
 * Update the whatsapp-ai-chatbot-ordering blog post with properly styled HTML
 * that matches the format used by other posts on orderviachat.com.
 */
const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');

async function updatePost() {
    const db = new SupabaseREST();
    const htmlContent = fs.readFileSync('C:\\tmp\\styled_blog_content.html', 'utf-8').trim();
    
    console.log('Content length:', htmlContent.length);
    console.log('First 200 chars:', htmlContent.substring(0, 200));
    
    try {
        const res = await fetch(db.restUrl + '/blog_posts?slug=eq.whatsapp-ai-chatbot-ordering', {
            method: 'PATCH',
            headers: db.headers,
            body: JSON.stringify({ content: htmlContent })
        });

        if (!res.ok) throw new Error('Update failed: ' + res.status + ' ' + await res.text());
        console.log('✅ Successfully updated blog post with styled HTML content!');
    } catch (e) {
        console.error('❌ Error:', e.message);
        process.exit(1);
    }
}

updatePost();
