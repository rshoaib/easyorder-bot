import { getAllBlogPosts } from '@/app/actions/blog-image-actions';
import BlogImageManager from '@/components/admin/BlogImageManager';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

export default async function BlogAdminPage({ params }: Props) {
    const { slug } = await params;
    const posts = await getAllBlogPosts();

    return (
        <main className="container pt-3 pb-10" style={{ maxWidth: '900px' }}>
            <div className="flex justify-between mb-8 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Blog Images</h1>
                    <p className="text-sm text-gray-500">Generate AI cover images for blog posts</p>
                </div>
                <Link href={`/store/${slug}/admin`}>
                    <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                </Link>
            </div>

            <div className="bg-indigo-50 text-indigo-700 p-4 rounded-xl text-sm mb-6 border border-indigo-100">
                <div className="flex items-center gap-2 font-bold mb-1">
                    <BookOpen size={16} />
                    AI Image Generation
                </div>
                <p>Click &quot;Generate&quot; or &quot;Regenerate&quot; to create a custom AI cover image. Images are generated using Gemini AI and stored in Supabase.</p>
            </div>

            <BlogImageManager posts={posts} />
        </main>
    );
}
