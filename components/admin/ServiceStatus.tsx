'use client';

import { useEffect, useState } from 'react';
import { checkSystemHealth } from '@/app/actions/system-actions';
import { CheckCircle2, XCircle, Loader2, Server } from 'lucide-react';

export default function ServiceStatus() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSystemHealth().then(res => {
            setStatus(res);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="animate-pulse h-20 bg-gray-50 rounded-xl mb-6"></div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Server size={18} /> System Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusItem label="AI Service (Gemini)" active={status.ai} />
                <StatusItem label="Database" active={status.database} />
                <StatusItem label="Email Service" active={status.email} />
            </div>
            {!status.ai && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-200">
                    ⚠️ AI features are disabled. Please add <strong>GEMINI_API_KEY</strong> to your Vercel Environment Variables.
                </div>
            )}
        </div>
    );
}

function StatusItem({ label, active }: { label: string, active: boolean }) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-xl border ${active ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <span className={`font-medium ${active ? 'text-green-900' : 'text-red-900'}`}>{label}</span>
            {active ? <CheckCircle2 size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
        </div>
    );
}
