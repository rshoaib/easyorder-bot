import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    // Determine the correct redirect base URL
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    let redirectBase = origin
    if (!isLocalEnv && forwardedHost) {
        redirectBase = `https://${forwardedHost}`
    }

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const redirectUrl = `${redirectBase}${next}`
            console.log('Code exchange successful, redirecting to:', redirectUrl);
            const response = NextResponse.redirect(redirectUrl)

            // Explicitly copy cookies from the cookie store string to the response
            const cookieStore = await cookies()
            cookieStore.getAll().forEach((cookie: any) => {
                response.cookies.set(cookie.name, cookie.value, cookie)
            })

            return response
        } else {
            console.error('Auth Callback Error:', error.message);
            console.error('Auth Error Code:', error.status);
            console.error('Origin:', origin, 'ForwardedHost:', forwardedHost);
            const errorMsg = encodeURIComponent(error.message || 'Code exchange failed')
            return NextResponse.redirect(`${redirectBase}/login?error=${errorMsg}&next=${encodeURIComponent(next)}`)
        }
    }

    // No code parameter - check for error from Supabase
    const errorDescription = searchParams.get('error_description') || searchParams.get('error') || 'No authorization code received'
    console.error('Auth Callback - No code:', errorDescription);
    return NextResponse.redirect(`${redirectBase}/login?error=${encodeURIComponent(errorDescription)}&next=${encodeURIComponent(next)}`)
}
