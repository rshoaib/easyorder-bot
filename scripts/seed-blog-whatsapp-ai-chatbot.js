const SupabaseREST = require('./supabase_rest.cjs');
const fs = require('fs');
const path = require('path');

async function seedBlogPost() {
  const db = new SupabaseREST();

  // Read the markdown content
  const mdPath = path.resolve('C:\\Users\\Riz\\.gemini\\antigravity\\brain\\05dc7797-2bea-4fe5-976c-c2f0bdd06f4c\\whatsapp-ai-chatbot-ordering.md');
  const fullContent = fs.readFileSync(mdPath, 'utf-8');

  // Strip frontmatter for the 'content' column
  const content = fullContent.replace(/---[\s\S]*?---/, '').trim();

  const post = {
    slug: 'whatsapp-ai-chatbot-ordering',
    title: 'WhatsApp AI Chatbot for Ordering: The 2026 Guide to Conversational Commerce',
    excerpt: 'Discover why restaurants are ditching traditional POS for WhatsApp AI Chatbots. See how zero-technical-setup conversational commerce can 10x your F&B and retail sales today.',
    date: '2026-03-13',
    author: 'OrderViaChat Team',
    category: 'Ordering Solutions',
    cover_image: '/images/blog/whatsapp-ai-chatbot-hero.png',
    content: content,
    is_published: true
  };

  try {
    const data = await db.safeInsertWithId('blog_posts', post, 'slug');
    if (data) {
      console.log('✅ Successfully inserted blog post: ' + post.slug);
    } else {
      console.log('⚠️ Blog post already exists or was skipped: ' + post.slug);
    }
  } catch (error) {
    console.error('❌ Error inserting blog post:', error.message);
    process.exit(1);
  }
}

seedBlogPost();
