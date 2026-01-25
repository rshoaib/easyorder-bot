
import Link from 'next/link';
import { getPost, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, ShoppingBag, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return {};

    return {
        title: `${post.title} | OrderViaChat Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            images: post.coverImage ? [post.coverImage] : [],
        }
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
             {/* Navbar (Simplified) */}
             <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <ShoppingBag strokeWidth={2.5} size={20} />
                        </div>
                        <span className="tracking-tight">OrderViaChat</span>
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/blog" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                            All Guides
                        </Link>
                        <Link href="/register">
                            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold hover:scale-105 transition-all text-sm">
                                Create Store
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            <article className="pt-32 pb-24">
                {/* Header */}
                <header className="max-w-3xl mx-auto px-6 mb-12">
                    <Link href="/blog" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Guides
                    </Link>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> {post.date}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 border-y border-slate-100 py-6">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                            {post.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-slate-900">{post.author}</div>
                            <div className="text-xs text-slate-500">Editor</div>
                        </div>
                        <div className="flex gap-2">
                             <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={18} /></button>
                             <button className="p-2 text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={18} /></button>
                             <button className="p-2 text-slate-400 hover:text-blue-700 transition-colors"><Linkedin size={18} /></button>
                             <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Share2 size={18} /></button>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="max-w-5xl mx-auto px-6 mb-16">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[400px]">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover object-center" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6">
                    <div 
                        className="prose prose-lg prose-indigo prose-img:rounded-2xl max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            {/* CTA */}
            <section className="bg-slate-50 py-20 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to apply what you learned?</h2>
                    <p className="text-xl text-slate-500 mb-8">
                        Join thousands of restaurant owners growing their business with OrderViaChat.
                    </p>
                    <Link href="/register">
                         <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1">
                            Start Your Free Store
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}
