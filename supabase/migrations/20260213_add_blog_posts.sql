-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_image TEXT,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Index for listing published posts by date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(is_published, date DESC);

-- Public read access (blog is public, no auth needed)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (true);

-- Create blog-images storage bucket (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to blog images
CREATE POLICY "Public read blog images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload blog images (for admin/seed scripts)
CREATE POLICY "Auth upload blog images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'blog-images');
