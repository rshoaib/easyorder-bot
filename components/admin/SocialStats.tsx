'use client';

import { SocialStats as SocialStatsType } from "@/app/actions/analytics-actions";
import { BarChart3, Heart, MessageCircle } from "lucide-react";

export default function SocialStats({ stats }: { stats: SocialStatsType }) {
    if (!stats) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Posts Tracked</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <BarChart3 size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Likes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <Heart size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Comments</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <MessageCircle size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Recent Post Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-3">Platform</th>
                                <th className="px-6 py-3">Product ID</th>
                                <th className="px-6 py-3 text-center">Likes</th>
                                <th className="px-6 py-3 text-center">Comments</th>
                                <th className="px-6 py-3 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 capitalize font-medium text-gray-900">{post.provider}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{post.productId.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 text-center font-medium">{post.likes}</td>
                                    <td className="px-6 py-4 text-center font-medium">{post.comments}</td>
                                    <td className="px-6 py-4 text-right text-gray-500">
                                        {new Date(post.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {stats.recentPosts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No tracked posts yet. Connect your accounts and add products to see data here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
