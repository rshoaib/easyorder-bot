'use client';

import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
    const url = `https://orderviachat.com/blog/${slug}`;
    const encodedTitle = encodeURIComponent(title);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        // We could add a toast here, but for now simple copy is fine.
        alert('Link copied to clipboard!');
    };

    return (
        <div className="flex gap-2">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={18} /></a>
            <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${url}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-sky-500 transition-colors"><Twitter size={18} /></a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-700 transition-colors"><Linkedin size={18} /></a>
            <button onClick={copyToClipboard} className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Copy Link"><Share2 size={18} /></button>
        </div>
    );
}
