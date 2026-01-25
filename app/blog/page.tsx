
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { ArrowRight, BookOpen, ShoppingBag } from 'lucide-react';

export default async function BlogIndex() {
    const posts = await getAllPosts();

    return (
        <main className="min-h-screen bg-slate-50">
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
                        <Link href="/register">
                            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold hover:scale-105 transition-all text-sm">
                                Create Store
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="pt-32 pb-16 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6">
                        <BookOpen size={16} />
                        <span>Resources</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Guides & Success Stories
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Tips, tutorials, and inspiration to help you grow your food business with WhatsApp.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        {post.coverImage && (
                                            <img 
                                                src={post.coverImage} 
                                                alt={post.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="text-sm text-slate-400 mb-2">{post.date}</div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center text-indigo-600 font-bold text-sm">
                                            Read Guide <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
