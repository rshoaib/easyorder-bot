'use client';

import { useState, useTransition } from 'react';
import { generateBlogImage } from '@/app/actions/blog-image-actions';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Image, RefreshCw } from 'lucide-react';

interface BlogPost {
    slug: string;
    title: string;
    cover_image: string | null;
    date: string;
    category: string;
}

export default function BlogImageManager({ posts }: { posts: BlogPost[] }) {
    const [statuses, setStatuses] = useState<Record<string, { status: 'idle' | 'generating' | 'success' | 'error'; message?: string; imageUrl?: string }>>({});

    async function handleGenerate(slug: string, title: string) {
        setStatuses(prev => ({ ...prev, [slug]: { status: 'generating' } }));

        try {
            const result = await generateBlogImage(slug, title);
            if (result.success) {
                setStatuses(prev => ({
                    ...prev,
                    [slug]: { status: 'success', message: 'Image generated!', imageUrl: result.imageUrl }
                }));
            } else {
                setStatuses(prev => ({
                    ...prev,
                    [slug]: { status: 'error', message: result.error || 'Generation failed' }
                }));
            }
        } catch (err: any) {
            setStatuses(prev => ({
                ...prev,
                [slug]: { status: 'error', message: err.message || 'Unexpected error' }
            }));
        }
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => {
                const state = statuses[post.slug] || { status: 'idle' };
                const currentImage = state.imageUrl || post.cover_image;

                return (
                    <div
                        key={post.slug}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Image Preview */}
                        <div className="w-full md:w-48 h-32 md:h-auto bg-slate-100 flex-shrink-0 relative">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Image size={32} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-slate-400">{post.date}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                                    {post.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleGenerate(post.slug, post.title)}
                                    disabled={state.status === 'generating'}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {state.status === 'generating' ? (
                                        <>
                                            <Loader2 size={12} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            {currentImage ? <RefreshCw size={12} /> : <Sparkles size={12} />}
                                            {currentImage ? 'Regenerate' : 'Generate Image'}
                                        </>
                                    )}
                                </button>

                                {state.status === 'success' && (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                        <CheckCircle size={12} /> Done!
                                    </span>
                                )}

                                {state.status === 'error' && (
                                    <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                                        <AlertCircle size={12} /> {state.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
