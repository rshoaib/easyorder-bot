---
site: orderviachat.com
git_branch: main
supabase_ref: ivhwrnpweubtodinsvvh
content_format: html
---

# OrderViaChat Site Registry

## Blog Schema (`blog_posts` table)

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | uuid | auto | Primary key |
| `slug` | text | ✅ | URL slug (kebab-case) |
| `title` | text | ✅ | Article title |
| `excerpt` | text | ✅ | Short description |
| `date` | text | ✅ | ISO date: `2026-03-27` |
| `author` | text | ✅ | e.g. `OrderViaChat Team` |
| `category` | text | ✅ | e.g. `Guides`, `Marketing` |
| `cover_image` | text | ✅ | Path: `/images/blog/{name}.png` |
| `content` | text | ✅ | **HTML** with Tailwind prose classes |
| `is_published` | boolean | ✅ | Must be `true` to display |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

## Image Hosting

- **Strategy**: Local file in `public/images/blog/`
- **Column**: `cover_image`
- **Path format**: `/images/blog/{slug}-hero.png`
- **⚠️ CRITICAL**: Image file MUST be `git add`-ed and pushed to `main`

## Content Format

- **Type**: HTML with inline Tailwind classes (text-slate-600, text-emerald-600, etc.)
- **Tables**: Include Tailwind classes directly in HTML (`class="w-full border-collapse..."`)
- **⚠️ IMPORTANT**: `is_published` must be set to `true` or article won't appear

## Supabase Access

- **⚠️ LOCAL ENV MISSING**: No `.env.local` exists locally — credentials only on Vercel
- **To get creds**: Use Vercel dashboard → Settings → Environment Variables
- **Or run**: `vercel link` then `vercel env pull` in the project directory

## Deployment

- **Git branch**: `main`
- **Host**: Vercel
- **Push command**: `git push origin main`

## Post-Insert Checklist

1. ☐ Image file exists in `public/images/blog/`
2. ☐ Image file is git-tracked (`git status` shows no `??`)
3. ☐ `cover_image` column matches the file path exactly
4. ☐ `is_published` is `true`
5. ☐ Push to `main` (NOT `master`)
6. ☐ Wait 90s, verify image URL returns 200
