import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);
    const url = request.nextUrl;
    const hostname = request.headers.get('host')!;

    // 1. Admin Protection (Supabase Auth)
    const isGlobalAdmin = url.pathname.startsWith('/admin');
    const storeAdminMatch = url.pathname.match(/^\/store\/([^/]+)\/admin/);
    const isStoreAdmin = !!storeAdminMatch;

    if (isGlobalAdmin || isStoreAdmin) {
        // Exclude login pages from protection to avoid redirect loops
        const isLoginPage = url.pathname === '/admin/login' || url.pathname.endsWith('/admin/login');
        if (!isLoginPage && !user) {
            if (storeAdminMatch) {
                return NextResponse.redirect(new URL(`/store/${storeAdminMatch[1]}/admin/login?next=${encodeURIComponent(url.pathname)}`, request.url));
            }
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
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
