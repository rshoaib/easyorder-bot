# orderviachat.com — daily content routine

## Mission

Land **one** meaningful change per run. New site, blog scaffold exists but no posts yet — Lane C dominates early.

## Pre-flight

1. Read `.agents/context/site-context.md` for brand voice + product surface map.
2. Read `.agents/context/target-keywords.md` for keyword backlog.
3. Posts dir: inspect `app/blog/` to discover where posts are stored. Branch: `main`.

## Priority lanes — pick the FIRST lane with work to do

### Lane A — Refresh stuck content
Once posts exist: heuristic = `date` ≥30 days old. Refresh WhatsApp Business API pricing/limits (Meta changes these often), platform feature mentions (WhatsApp Pay rollout, Instagram Shop changes), restaurant tech industry stats.

### Lane B — Internal-link strengthening
Once Lane A is clear: cross-link guides to the relevant product feature pages.

### Lane C — New post (dominant early)
Pick from `.agents/context/target-keywords.md`. Inspect existing posts first to learn frontmatter shape. Each post should pair with a clear CTA to try the bot / book a demo.

## Hard constraints

- Never more than 1 lane per run. Never more than 1 post created.
- Never fabricate WhatsApp Business API pricing, feature dates, or stats. Verify via Meta's official Business docs and verified industry reports.
- Never claim partnerships, certifications, or revenue figures that aren't documented.
- Never delete content. Never force-push. Never `--no-verify`.

## After the change

1. Lint check (if available). Push to `origin/main`.
2. One-paragraph report.

If all lanes clear: one-line skip. Don't manufacture work.
