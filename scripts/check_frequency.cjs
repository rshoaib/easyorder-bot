const SupabaseREST = require('./supabase_rest.cjs');

async function main() {
  try {
    const db = new SupabaseREST();
    const posts = await db.select('blog_posts', 'title,date,slug,id');

    if (!Array.isArray(posts)) {
      console.error("Posts is not an array. Check Supabase REST integration.", posts);
      process.exit(1);
    }
    
    // Sort posts by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate dates based on 2026-03-17T15:36:03+03:00 (Today is Tuesday)
    // Actually, let's use JS Date since the time is close enough to local
    const nowLocalStr = "2026-03-17T15:36:03+03:00";
    const now = new Date(nowLocalStr);
    
    // Start of today in local timezone
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    // To cleanly get start of today without timezone issues:
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const startOfTodayPrefix = `${year}-${month}-${day}`; 

    const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // e.g., Tuesday: diff = -1
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diffToMonday);
    const startOfWeekPrefix = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
    
    let total = posts.length;
    let lastPublished = posts.length > 0 ? posts[0].date : "Never";
    let lastPublishedTitle = posts.length > 0 ? posts[0].title : "";

    let publishedToday = 0;
    let publishedThisWeek = 0;
    let weeklyTitles = [];

    for (let p of posts) {
      if (!p.date) continue;
      const t = new Date(p.date);
      // local string format: "2026-03-17"
      const pYear = t.getFullYear();
      const pMonth = String(t.getMonth() + 1).padStart(2, '0');
      const pDay = String(t.getDate()).padStart(2, '0');
      const pPrefix = `${pYear}-${pMonth}-${pDay}`;
      
      if (pPrefix === startOfTodayPrefix) {
        publishedToday++;
      }
      
      // Since it's sorted, we can check if it's within the week
      // start of week is March 16. Today is March 17. 
      // t >= startOfWeek (beginning of monday)
      const mondayMidnight = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
      if (t >= mondayMidnight) {
        publishedThisWeek++;
        weeklyTitles.push(`${pPrefix} - ${p.title}`);
      }
    }

    const todaySlotsLeft = 1 - publishedToday;
    const weekSlotsLeft = 3 - publishedThisWeek;

    const report = `╔══════════════════════════════════════════════════════╗
║  📊 Content Dashboard — orderviachat.com           ║
╠══════════════════════════════════════════════════════╣
║  📦 Total Articles      │ ${String(total).padEnd(26, ' ')} ║
║  📅 Last Published      │ ${String(lastPublishedTitle).slice(0,25).padEnd(26, ' ')} ║
╠─────────────────────────┼──────────────────────────╣
║  ✍️ Published Today      │ ${publishedToday} of 1 ${publishedToday >= 1 ? '⬛' : '⬜'}                 ║
║  📆 Published This Week │ ${publishedThisWeek} of 3 ${'⬛'.repeat(publishedThisWeek)}${'⬜'.repeat(3 - publishedThisWeek)}              ║
╠─────────────────────────┼──────────────────────────╣
║  🟢 Today Slots Left    │ ${todaySlotsLeft}                        ║
║  🟢 Week Slots Left     │ ${weekSlotsLeft}                        ║
╠══════════════════════════════════════════════════════╣
║  This week's articles:                              ║
${weeklyTitles.map(wt => `║  • ${wt.padEnd(51, ' ')}║`).join('\n')}
╚══════════════════════════════════════════════════════╝`;

    require('fs').writeFileSync('frequency_report.txt', report, 'utf-8');
    console.log("Report generated in frequency_report.txt");

  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

main();
