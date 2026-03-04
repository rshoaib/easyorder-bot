'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyableFieldProps {
    value: string;
    icon?: React.ReactNode;
    label?: string;
}

export default function CopyableField({ value, icon, label }: CopyableFieldProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            title={`Copy ${label || value}`}
            className="group/copy flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors max-w-full cursor-pointer"
        >
            {icon}
            <span className="truncate">{value}</span>
            {copied ? (
                <Check size={12} className="text-green-500 flex-shrink-0" />
            ) : (
                <Copy size={12} className="opacity-0 group-hover/copy:opacity-100 transition-opacity flex-shrink-0" />
            )}
        </button>
    );
}
