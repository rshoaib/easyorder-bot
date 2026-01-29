'use client';

import { Tenant } from "@/lib/repository/types";
import { CheckCircle2, Circle, ArrowRight, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
    tenant: Tenant;
    productCount: number;
    slug: string;
}

export default function QuickStartGuide({ tenant, productCount, slug }: Props) {
    const [isSharing, setIsSharing] = useState(false);

    // Calculate Progress
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
            description: 'Critical for receiving orders.',
            icon: !!tenant.ownerPhone ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-slate-300" />,
            action: { label: 'Configure', href: `/store/${slug}/admin/settings` }
        },
        {
            id: 'products',
            label: 'Add Products',
            completed: productCount > 0,
            description: 'Add at least 1 item or use AI.',
            icon: productCount > 0 ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-slate-300" />,
            action: { label: 'Add Items', href: `/store/${slug}/admin/menu` }
        },
        {
            id: 'logo',
            label: 'Upload Logo',
            completed: !!tenant.logoUrl,
            description: 'Make your store look professional.',
            icon: !!tenant.logoUrl ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-slate-300" />,
            action: { label: 'Upload', href: `/store/${slug}/admin/settings` }
        },
        {
            id: 'share',
            label: 'Share Store',
            completed: isSharing, // Simple local state for now, or could check traffic
            description: 'Send link to your first customer.',
            icon: isSharing ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-slate-300" />,
            action: { 
                label: 'Share', 
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
        }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    // If 100% complete, maybe don't show it? Or show a success banner.
    // For now, if 100%, show a minimized version or success message.
    if (progress === 100 && !isSharing) { 
        // Small tweak: keep showing if they just finished sharing to give satisfaction
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
                    <div key={step.id} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${step.completed ? 'opacity-75' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-6 h-6 flex items-center justify-center">
                                {step.icon}
                            </div>
                            <div>
                                <div className={`font-medium ${step.completed ? 'text-slate-900 decoration-slate-400' : 'text-slate-900'}`}>
                                    {step.label}
                                </div>
                                {step.description && !step.completed && (
                                    <div className="text-xs text-slate-500">{step.description}</div>
                                )}
                            </div>
                        </div>

                        {step.action && !step.completed && (
                            <div>
                                {step.action.href ? (
                                    <Link href={step.action.href}>
                                        <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                                            {step.action.label} <ArrowRight size={12} />
                                        </button>
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={step.action.onClick}
                                        className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 border border-indigo-200"
                                    >
                                        {step.action.label} <ExternalLink size={12} />
                                    </button>
                                )}
                            </div>
                        )}
                        
                         {step.completed && step.id === 'whatsapp' && (
                             <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                                 Generic verification? <Link href={`https://wa.me/${tenant.ownerPhone}?text=Test`} target="_blank" className="underline hover:text-green-700">Test</Link>
                             </div>
                         )}
                    </div>
                ))}
            </div>
        </div>
    );
}
