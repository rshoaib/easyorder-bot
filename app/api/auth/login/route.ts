import { NextRequest, NextResponse } from 'next/server';
import { getTenantRepository } from '@/lib/repository';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { password, slug } = body;

        // If no slug provided, we might be in Super Admin login or legacy
        // For now, let's handle Tenant Login

        let validPassword = process.env.ADMIN_PASSWORD;

        if (slug) {
            const tenantRepo = getTenantRepository();
            const tenant = await tenantRepo.getTenantBySlug(slug);
            if (!tenant) {
                return new NextResponse('Store not found', { status: 404 });
            }
            // Use tenant password if set, otherwise fallback (for migration)
            validPassword = tenant.password || process.env.ADMIN_PASSWORD;
        } else {
            // Super Admin Login (no slug)
            // strict check against env var
            validPassword = process.env.ADMIN_PASSWORD;
        }

        if (password === validPassword) {
            const response = NextResponse.json({ success: true });

            // Set HTTP-only cookie
            // If it was a Super Admin login (no slug), set a special cookie
            // If it was a Tenant login, set regular auth cookie

            const cookieName = slug ? 'auth' : 'super_auth';

            response.cookies.set(cookieName, 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            // If super admin, also set regular auth so they can access store admins? 
            // Yes, useful convenience.
            if (!slug) {
                response.cookies.set('auth', 'true', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                });
            }

            return response;
        } else {
            return new NextResponse('Invalid Password', { status: 401 });
        }
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}
