'use client';

import { usePathname } from "next/navigation";

export default function DemoAdminButton() {
    const pathname = usePathname();

    // Don't show if we are already in the admin section
    if (pathname.includes('/admin')) return null;

    return (
        <a 
          href="/store/demo/admin" 
          className="fixed bottom-24 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-full shadow-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform border border-gray-700 animate-bounce"
        >
          Try Admin Panel 🚀
        </a>
    );
}
