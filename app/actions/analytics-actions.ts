'use server';

import { getTenantRepository } from "@/lib/repository";
import { verifyTenantOwnership } from "@/lib/auth/security";
import axios from "axios";

export interface SocialStats {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    recentPosts: {
        id: string;
        externalPostId: string;
        provider: 'facebook' | 'instagram';
        likes: number;
        comments: number;
        date: string;
        productId: string;
    }[];
}

export async function getSocialStats(slug: string): Promise<SocialStats> {
    const { tenant } = await verifyTenantOwnership(slug);
    const repo = getTenantRepository();

    const [fbIntegration, igIntegration, posts] = await Promise.all([
        repo.getIntegration(tenant.id, 'facebook'),
        repo.getIntegration(tenant.id, 'instagram'),
        repo.getSocialPosts(tenant.id)
    ]);

    let totalLikes = 0;
    let totalComments = 0;
    const recentPostsWithStats: SocialStats['recentPosts'] = [];

    // Fetch stats for each post
    // This could be slow if many posts. Limit is 50 in repo.
    // Ideally we'd use batch requests or background jobs, but for MVP separate requests are okay.
    // Facebook Batch API is an option but adds complexity.

    await Promise.all(posts.map(async (post) => {
        let likes = 0;
        let comments = 0;

        try {
            if (post.provider === 'facebook' && fbIntegration?.accessToken) {
                // FB: fields=likes.summary(true),comments.summary(true)
                const url = `https://graph.facebook.com/v19.0/${post.externalPostId}?fields=likes.summary(true),comments.summary(true)&access_token=${fbIntegration.accessToken}`;
                const res = await axios.get(url);
                likes = res.data.likes?.summary?.total_count || 0;
                comments = res.data.comments?.summary?.total_count || 0;
            }
            else if (post.provider === 'instagram' && igIntegration?.accessToken) {
                // IG Media: fields=like_count,comments_count
                const url = `https://graph.facebook.com/v19.0/${post.externalPostId}?fields=like_count,comments_count&access_token=${igIntegration.accessToken}`;
                const res = await axios.get(url);
                likes = res.data.like_count || 0;
                comments = res.data.comments_count || 0;
            }
        } catch (error) {
            console.error(`Failed to fetch stats for post ${post.id}:`, error);
            // Continue usage with 0 stats
        }

        totalLikes += likes;
        totalComments += comments;

        recentPostsWithStats.push({
            id: post.id,
            externalPostId: post.externalPostId,
            provider: post.provider,
            likes,
            comments,
            date: post.createdAt,
            productId: post.productId
        });
    }));

    return {
        totalPosts: posts.length,
        totalLikes,
        totalComments,
        recentPosts: recentPostsWithStats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
}
