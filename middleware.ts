import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);
    const url = request.nextUrl;
    const hostname = request.headers.get('host')!;

    // 0. Canonical Domain Redirect
    if (hostname.includes('easyorder-bot.vercel.app')) {
        return NextResponse.redirect(`https://orderviachat.com${url.pathname}${url.search}`);
    }

    // 1. Admin Protection (Supabase Auth)
    const isGlobalAdmin = url.pathname.startsWith('/admin');
    const isSuperAdmin = url.pathname.startsWith('/super-admin');
    const storeAdminMatch = url.pathname.match(/^\/store\/([^/]+)\/admin/);
    const isStoreAdmin = !!storeAdminMatch;

    if (isGlobalAdmin || isStoreAdmin || isSuperAdmin) {
        const isLoginPage = url.pathname === '/admin/login' || url.pathname.endsWith('/admin/login') || url.pathname === '/super-admin/login';
        const hasSuperAuthCookie = isSuperAdmin && request.cookies.get('super_auth')?.value === 'true';

        if (!isLoginPage && !user && !hasSuperAuthCookie) {
            const isDemoAdmin = storeAdminMatch && storeAdminMatch[1] === 'demo';
            if (isDemoAdmin) return supabaseResponse;
            if (isSuperAdmin) return NextResponse.redirect(new URL('/super-admin/login', request.url));
            if (storeAdminMatch) return NextResponse.redirect(new URL(`/store/${storeAdminMatch[1]}/admin/login?next=${encodeURIComponent(url.pathname)}`, request.url));
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. Custom Domain Handling
    const currentDomain = hostname.replace('.localhost:3000', '');
    const isVercelDomain = currentDomain.includes('vercel.app') || currentDomain.includes('orderviachat.com') || currentDomain.includes('localhost');

    if (!isVercelDomain) {
        const response = NextResponse.rewrite(new URL(`/custom-domain/${hostname}${url.pathname}`, request.url));
        supabaseResponse.cookies.getAll().forEach(cookie => {
            response.cookies.set(cookie.name, cookie.value, cookie);
        });
        return response;
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
