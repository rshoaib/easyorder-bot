'use client';

import { useState } from 'react';

interface CopyButtonProps {
    text: string;
    label: string;
    icon: string;
    className?: string;
}

export default function CopyButton({ text, label, icon, className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <button
            onClick={handleCopy}
            title={`Copy ${label}`}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 ${
                copied
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            } ${className}`}
        >
            <span>{copied ? '✓' : icon}</span>
            <span className="truncate max-w-[140px]">{copied ? 'Copied!' : text}</span>
        </button>
    );
}
