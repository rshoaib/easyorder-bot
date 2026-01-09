import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host')!;

    // 1. Admin Protection (Existing)
    if (url.pathname.startsWith('/admin')) {
        if (url.pathname === '/admin/login') {
            return NextResponse.next();
        }
        const authenticated = request.cookies.get('admin_authenticated');
        if (!authenticated) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 2. Custom Domain Handling
    // Define the domains that constitute "our app" and should NOT be treated as custom domains.
    // Replace 'easyorder-bot.vercel.app' with your actual Vercel domain.
    // Also include localhost for dev.
    const isOurDomain =
        hostname.includes('vercel.app') ||
        hostname.includes('localhost') ||
        hostname.includes('easyorder.com'); // Future proofing

    if (!isOurDomain) {
        // It's a custom domain! (e.g. menu.pizza.com)
        // We rewrite it to a special route that handles domain lookup.
        // We pass the hostname as the dynamic route param.

        // Preserve the path (e.g. /cart, /item/123)
        // Rewrite: menu.pizza.com/foo -> /custom-domain/menu.pizza.com/foo

        // Note: we must encode the domain to be safe, but usually fine.
        return NextResponse.rewrite(new URL(`/custom-domain/${hostname}${url.pathname}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
