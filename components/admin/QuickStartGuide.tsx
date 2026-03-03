'use client';

import { Tenant } from "@/lib/repository/types";
import { CheckCircle2, Circle, ExternalLink, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
    tenant: Tenant;
    productCount: number;
    slug: string;
}

export default function QuickStartGuide({ tenant, productCount, slug }: Props) {
    const [isSharing, setIsSharing] = useState(false);

    // Fix 2: Simplified to just 3 steps — Store Created, WhatsApp, Share
    const steps = [
        {
            id: 'store',
            label: 'Store Created',
            completed: true,
            icon: <CheckCircle2 className="text-green-500" />,
            action: null
        },
        {
            id: 'whatsapp',
            label: 'Connect WhatsApp',
            completed: !!tenant.ownerPhone,
            description: 'Without this, customers cannot order! Add your number with country code.',
            icon: !!tenant.ownerPhone 
                ? <CheckCircle2 className="text-green-500" /> 
                : <Circle className="text-red-400 animate-pulse" />,
            action: { label: 'Set Number →', href: `/store/${slug}/admin/settings` }
        },
        {
            id: 'share',
            label: 'Share Your Store',
            completed: isSharing,
            description: 'Send your store link to your first customer!',
            icon: isSharing ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-slate-300" />,
            action: { 
                label: 'Share →', 
                onClick: () => {
                    const url = `${window.location.origin}/store/${slug}`;
                    if (navigator.share) {
                        navigator.share({
                            title: tenant.name,
                            text: `Order from ${tenant.name} on WhatsApp!`,
                            url: url
                        }).catch(console.error);
                    } else {
                        navigator.clipboard.writeText(url);
                        alert("Link copied to clipboard!");
                    }
                    setIsSharing(true);
                } 
            }
        },
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    // 100% complete — celebration banner
    if (progress === 100) {
        return (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 flex items-center justify-between gap-4 flex-wrap animate-in fade-in duration-500">
                <div className="flex items-center gap-3">
                    <PartyPopper size={32} className="text-green-600 shrink-0" />
                    <div>
                        <h2 className="font-bold text-green-900 text-lg">🎉 Your store is fully set up!</h2>
                        <p className="text-sm text-green-700">Share your store link to start receiving orders on WhatsApp.</p>
                    </div>
                </div>
                <Link href={`/store/${slug}`} target="_blank">
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shrink-0">
                        View Your Store <ExternalLink size={14} />
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden mb-8">
            <div className="bg-indigo-50/50 p-6 border-b border-indigo-50">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        🚀 Quick Start Guide
                    </h2>
                    <span className="text-sm font-bold text-indigo-600">{progress}% Complete</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {steps.map((step) => (
                    <div key={step.id} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${step.completed ? 'opacity-70' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-6 h-6 flex items-center justify-center">
                                {step.icon}
                            </div>
                            <div>
                                <div className={`font-medium ${step.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                    {step.label}
                                </div>
                                {step.description && !step.completed && (
                                    <div className="text-xs text-slate-500 max-w-xs">{step.description}</div>
                                )}
                            </div>
                        </div>

                        {step.action && !step.completed && (
                            <div>
                                {'href' in step.action && step.action.href ? (
                                    <Link href={step.action.href}>
                                        <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                                            {step.action.label}
                                        </button>
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={'onClick' in step.action ? step.action.onClick : undefined}
                                        className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 border border-indigo-200"
                                    >
                                        {step.action.label} <ExternalLink size={12} />
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {step.completed && step.id === 'whatsapp' && (
                            <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                                Verified ✓ <Link href={`https://wa.me/${tenant.ownerPhone}?text=Test`} target="_blank" className="underline hover:text-green-700">Send Test</Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
