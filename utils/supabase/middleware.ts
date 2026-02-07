import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // This allows us to set cookies in the response
                    // that will be sent to the browser.
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // DEVELOPMENT BYPASS
    // If in development and we have a special cookie, mock the user
    if (process.env.NODE_ENV === 'development' && !user) {
        const devCookie = request.cookies.get('supabase-dev-token');
        if (devCookie && devCookie.value === 'dev-bypass') {
            return {
                supabaseResponse,
                user: {
                    id: 'dev-user-id',
                    email: 'testuser@gmail.com',
                    role: 'authenticated',
                    aud: 'authenticated',
                    app_metadata: { provider: 'email' },
                    user_metadata: {},
                    created_at: new Date().toISOString(),
                    email_confirmed_at: new Date().toISOString(), // Confirmed!
                } as any
            }
        }
    }

    return { supabaseResponse, user }
}
