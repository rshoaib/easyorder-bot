import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);
    const url = request.nextUrl;
    const hostname = request.headers.get('host')!;

    // 1. Admin Protection (Supabase Auth)
    if (url.pathname.startsWith('/admin')) {
        // Exclude login page from protection to avoid loop if we ever put it under /admin (though currently /login)
        if (url.pathname !== '/admin/login' && !user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. Custom Domain Handling
    const currentDomain = hostname.replace('.localhost:3000', '');
    const isVercelDomain = currentDomain.includes('vercel.app') || currentDomain.includes('orderviachat.com') || currentDomain.includes('localhost');

    // If it's a custom domain
    if (!isVercelDomain) {
        // Rewrite Logic
        const response = NextResponse.rewrite(new URL(`/custom-domain/${hostname}${url.pathname}`, request.url));
        // Important: Carry over auth cookies manually
        supabaseResponse.cookies.getAll().forEach(cookie => {
            response.cookies.set(cookie.name, cookie.value, cookie);
        });
        return response;
    }

    // Normal response with auth cookies
    return supabaseResponse;
}

export const config = {
    matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
