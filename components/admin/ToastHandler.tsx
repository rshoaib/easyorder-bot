'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export default function ToastHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const saved = searchParams.get('saved');
        const error = searchParams.get('error');

        if (saved) {
            toast.success('Settings saved successfully!');
            
            // Clean up the URL without triggering a full page reload
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.delete('saved');
            router.replace(`${pathname}?${newSearchParams.toString()}`);
        }

        if (error) {
            toast.error(decodeURIComponent(error));
            
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.delete('error');
            router.replace(`${pathname}?${newSearchParams.toString()}`);
        }
    }, [searchParams, pathname, router]);

    return null; // This component doesn't render anything visually
}
