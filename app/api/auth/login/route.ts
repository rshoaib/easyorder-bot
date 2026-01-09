import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { password } = body;

        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_PASSWORD) {
            console.error('ADMIN_PASSWORD is not set in environment variables');
            return new NextResponse('Server Misconfigured', { status: 500 });
        }

        if (password === ADMIN_PASSWORD) {
            const response = NextResponse.json({ success: true });

            // Set HTTP-only cookie
            response.cookies.set('admin_authenticated', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return response;
        } else {
            return new NextResponse('Invalid Password', { status: 401 });
        }
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}
