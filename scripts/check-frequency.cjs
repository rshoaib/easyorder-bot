const SupabaseREST = require('./supabase_rest.cjs');

async function checkFrequency() {
  const supabase = new SupabaseREST();
  
  try {
    const posts = await supabase.select('blog_posts', 'id,title,date,slug,author');
    
    const now = new Date();
    // Start of today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of this week (Monday)
    const dayOfWeek = now.getDay() || 7; // 1-7 (Mon-Sun)
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - (dayOfWeek - 1));
    
    let publishedToday = 0;
    let publishedThisWeek = [];
    let lastPublishedDate = null;
    
    // Sort descending by date
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (posts.length > 0) {
      lastPublishedDate = new Date(posts[0].date);
    }
    
    for (const post of posts) {
      const pubDate = new Date(post.date);
      if (pubDate >= startOfToday) {
        publishedToday++;
      }
      if (pubDate >= startOfWeek) {
        publishedThisWeek.push({ title: post.title, date: pubDate });
      }
    }
    
    console.log(JSON.stringify({
      total: posts.length,
      lastPublished: lastPublishedDate ? lastPublishedDate.toISOString() : null,
      publishedToday,
      publishedThisWeek,
      slotsToday: 1 - publishedToday,
      slotsWeek: 3 - publishedThisWeek.length
    }, null, 2));

  } catch (err) {
    console.error("Error:", err);
  }
}

checkFrequency();
