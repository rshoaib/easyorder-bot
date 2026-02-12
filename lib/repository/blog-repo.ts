import { supabase } from '../supabase';
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

function mapRowToPost(row: BlogPostRow): BlogPost {
    return {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        date: row.date,
        author: row.author,
        category: row.category,
        coverImage: row.cover_image || undefined,
        content: row.content,
    };
}

export class SupabaseBlogRepository {
    private client: SupabaseClient;

    constructor(client: SupabaseClient | null = null) {
        this.client = client || supabase;
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
            if (error?.code !== 'PGRST116') { // Not a "no rows" error
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
