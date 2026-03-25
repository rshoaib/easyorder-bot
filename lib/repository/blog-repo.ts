import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    coverImage?: string;
    content: string;
}

interface BlogPostRow {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    cover_image: string | null;
    content: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

function generateDynamicCoverUrl(title: string, category: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://orderviachat.com';
    const params = new URLSearchParams({ title, category });
    return `${baseUrl}/api/og/blog?${params.toString()}`;
}

function mapRowToPost(row: BlogPostRow): BlogPost {
    return {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        date: row.date,
        author: row.author,
        category: row.category,
        coverImage: row.cover_image || generateDynamicCoverUrl(row.title, row.category),
        content: row.content,
    };
}

// Use service role key on the server side to bypass RLS on blog_posts
// (blog posts are public content, so this is safe)
function getAdminClient(): SupabaseClient {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        // Return placeholder during build — queries will fail gracefully below
        return createClient('https://placeholder.supabase.co', 'placeholder');
    }
    return createClient(url, key);
}

export class SupabaseBlogRepository {
    private client: SupabaseClient;

    constructor(client: SupabaseClient | null = null) {
        this.client = client || getAdminClient();
    }

    async getAllPosts(): Promise<BlogPost[]> {
        const { data, error } = await this.client
            .from('blog_posts')
            .select('*')
            .eq('is_published', true)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }

        return (data as BlogPostRow[]).map(mapRowToPost);
    }

    async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
        const { data, error } = await this.client
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (error || !data) {
            if (error?.code !== 'PGRST116') {
                console.error('Error fetching blog post:', error);
            }
            return undefined;
        }

        return mapRowToPost(data as BlogPostRow);
    }
}

export function getBlogRepository(client: SupabaseClient | null = null) {
    return new SupabaseBlogRepository(client);
}
