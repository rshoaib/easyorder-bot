'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DevLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleBypass = () => {
        setLoading(true);
        // Set the cookie
        document.cookie = "supabase-dev-token=dev-bypass; path=/; max-age=3600; SameSite=Lax";
        
        setTimeout(() => {
            router.push('/dashboard');
        }, 500);
    };

    if (process.env.NODE_ENV !== 'development') {
        return <div>Not available in production</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-sm w-full text-center">
                <h1 className="text-xl font-bold mb-2">Development Bypass</h1>
                <p className="text-sm text-gray-500 mb-6">Skip email verification and log in as a test user.</p>
                
                <button 
                    onClick={handleBypass}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    {loading ? 'Logging in...' : 'Login as Test User'}
                </button>
            </div>
        </div>
    );
}
