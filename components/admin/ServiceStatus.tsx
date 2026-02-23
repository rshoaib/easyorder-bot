'use client';

import { useEffect, useState } from 'react';
import { checkSystemHealth } from '@/app/actions/system-actions';
import { generateProductDescription } from '@/app/actions/ai-actions';
import { CheckCircle2, XCircle, Loader2, Server, Play } from 'lucide-react';

export default function ServiceStatus() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [aiTestResult, setAiTestResult] = useState<any>(null);
    const [testingAi, setTestingAi] = useState(false);

    useEffect(() => {
        checkSystemHealth().then(res => {
            setStatus(res);
            setLoading(false);
        });
    }, []);

    const runAiTest = async () => {
        setTestingAi(true);
        setAiTestResult(null);
        try {
            const res = await generateProductDescription('Debug Item', 'Debug Category');
            setAiTestResult(res);
        } catch (e: any) {
            setAiTestResult({ success: false, message: e.message });
        }
        setTestingAi(false);
    };

    if (loading) return <div className="animate-pulse h-20 bg-gray-50 rounded-xl mb-6"></div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Server size={18} /> System Status
                </h2>
                {status.ai && (
                    <button 
                        onClick={runAiTest} 
                        disabled={testingAi}
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"
                    >
                        {testingAi ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                        Test AI Connection
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusItem label="AI Service (Gemini)" active={status.ai} />
                <StatusItem label="Database" active={status.database} />
                <StatusItem label="Email Service" active={status.email} optional />
            </div>

            {aiTestResult && (
                <div className={`mt-4 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap border ${aiTestResult.success ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    <strong>AI Debug Result:</strong>
                    {JSON.stringify(aiTestResult, null, 2)}
                </div>
            )}

            {!status.ai && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-200">
                    ⚠️ AI features are disabled. Please add <strong>GEMINI_API_KEY</strong> to your Vercel Environment Variables.
                </div>
            )}
        </div>
    );
}

function StatusItem({ label, active, optional }: { label: string, active: boolean, optional?: boolean }) {
    // For optional services (like email), show neutral gray instead of alarming red
    if (!active && optional) {
        return (
            <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50 border-gray-100">
                <span className="font-medium text-gray-500">{label}</span>
                <span className="text-xs font-bold text-gray-400 px-2 py-0.5 rounded bg-gray-100">N/A</span>
            </div>
        );
    }
    return (
        <div className={`flex items-center justify-between p-3 rounded-xl border ${active ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <span className={`font-medium ${active ? 'text-green-900' : 'text-red-900'}`}>{label}</span>
            {active ? <CheckCircle2 size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
        </div>
    );
}
