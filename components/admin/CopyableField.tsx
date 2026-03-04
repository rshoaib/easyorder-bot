'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyAllButtonProps {
    storeName: string;
    email?: string;
    phone?: string;
}

export default function CopyAllButton({ storeName, email, phone }: CopyAllButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const lines = [
            storeName,
            email ? `Email: ${email}` : 'Email: N/A',
            phone ? `WhatsApp: ${phone}` : 'WhatsApp: N/A',
        ];
        await navigator.clipboard.writeText(lines.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                copied
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
            }`}
        >
            {copied ? (
                <><Check size={14} /> Copied!</>
            ) : (
                <><Copy size={14} /> Copy Info</>
            )}
        </button>
    );
}
