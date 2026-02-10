'use client';

import { useState } from "react";
import { SocialStats } from "@/app/actions/analytics-actions";
import { getPostComments, replyToComment } from "@/app/actions/social-actions";
import { generateCommentReply } from "@/app/actions/ai-actions";
import { MessageCircle, Send, Sparkles, Loader2, User, RefreshCw, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";

interface Comment {
    id: string;
    message: string;
    created_time: string;
    from?: { name: string; id: string };
}

export default function SocialInbox({ posts }: { posts: SocialStats['recentPosts'] }) {
    const params = useParams();
    const slug = params.slug as string;

    const [selectedPost, setSelectedPost] = useState<SocialStats['recentPosts'][0] | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSelectPost = async (post: SocialStats['recentPosts'][0]) => {
        setSelectedPost(post);
        setLoadingComments(true);
        setComments([]);
        setReplyingTo(null);

        const result = await getPostComments(slug, post.externalPostId, post.provider);
        if (result.success) {
            setComments(result.data);
        } else {
            console.error(result.error);
        }
        setLoadingComments(false);
    };

    const handleGenerateReply = async (comment: Comment) => {
        setIsGenerating(true);
        setReplyingTo(comment.id);
        setReplyText("");
        
        // Context: We assume store type/name is available in context or we pass it.
        // For now, simpler context.
        const result = await generateCommentReply(comment.message, selectedPost?.productId || "our product");
        
        if (result.success) {
            setReplyText(result.reply || "");
        } else {
            alert("Failed to generate reply");
        }
        setIsGenerating(false);
    };

    const handleSendReply = async (commentId: string) => {
        if (!selectedPost || !replyText) return;

        setIsSending(true);
        const result = await replyToComment(slug, commentId, replyText, selectedPost.provider);
        
        if (result.success) {
            alert("Reply sent!");
            setReplyingTo(null);
            setReplyText("");
            // Ideally refresh comments to see reply
        } else {
            alert("Failed to send reply: " + result.error);
        }
        setIsSending(false);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex h-[600px]">
            {/* Post List Sidebar */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <h3 className="font-semibold text-gray-900 mb-1">Recent Posts</h3>
                    <p className="text-xs text-gray-500">Select a post to manage comments</p>
                </div>
                <div className="divide-y divide-gray-100">
                    {posts.map((post) => (
                        <button
                            key={post.id}
                            onClick={() => handleSelectPost(post)}
                            className={`w-full text-left p-4 hover:bg-white transition-colors flex flex-col gap-2 ${selectedPost?.id === post.id ? 'bg-white border-l-4 border-blue-600 shadow-sm' : ''}`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${post.provider === 'facebook' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                    {post.provider}
                                </span>
                                <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900 truncate w-full">
                                Product: {post.productId.substring(0, 8)}...
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.comments} comments</span>
                            </div>
                        </button>
                    ))}
                    {posts.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">No posts found.</div>
                    )}
                </div>
            </div>

            {/* Comments Area */}
            <div className="w-2/3 flex flex-col bg-white">
                {selectedPost ? (
                    <>
                         <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="font-medium text-gray-900">Comments for {selectedPost.provider} post</h3>
                                <p className="text-xs text-gray-500 font-mono">{selectedPost.externalPostId}</p>
                            </div>
                            <button 
                                onClick={() => handleSelectPost(selectedPost)} 
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                                title="Refresh Comments"
                            >
                                <RefreshCw size={16} className={loadingComments ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loadingComments ? (
                                <div className="flex items-center justify-center h-full text-gray-400 gap-2">
                                    <Loader2 className="animate-spin" /> Loading comments...
                                </div>
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="group bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                                <User size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-sm text-gray-900">{comment.from?.name || 'User'}</span>
                                                    <span className="text-xs text-gray-400">{new Date(comment.created_time).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">{comment.message}</p>
                                            </div>
                                        </div>

                                        {replyingTo === comment.id ? (
                                            <div className="mt-3 pl-11 animate-in fade-in slide-in-from-top-2">
                                                <div className="relative">
                                                    <textarea
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                                        rows={3}
                                                        placeholder="Write a reply..."
                                                        disabled={isSending}
                                                    />
                                                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                                        <button 
                                                            onClick={() => setReplyingTo(null)}
                                                            className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            onClick={() => handleSendReply(comment.id)}
                                                            disabled={isSending || !replyText.trim()}
                                                            className="bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                {isGenerating && (
                                                    <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                                        <Sparkles size={12} className="animate-pulse" /> Generating AI reply...
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-2 pl-11 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setReplyingTo(comment.id); setReplyText(""); }}
                                                    className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                                                >
                                                    <MessageSquare size={12} /> Reply manually
                                                </button>
                                                <button 
                                                    onClick={() => handleGenerateReply(comment)}
                                                    className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full hover:bg-purple-100 transition-colors"
                                                >
                                                    <Sparkles size={12} /> Generate AI Reply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageCircle size={48} className="mb-2 text-gray-200" />
                                    <p>No comments on this post yet.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageCircle size={48} className="mb-4 text-gray-200" />
                        <p>Select a post from the left to view and manage comments.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
