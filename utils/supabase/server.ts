import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    // DEVELOPMENT BYPASS
    if (process.env.NODE_ENV === 'development') {
        const devCookie = cookieStore.get('supabase-dev-token');
        if (devCookie && devCookie.value === 'dev-bypass') {
            // Monkey patch getUser to return our mock user
            const originalGetUser = supabase.auth.getUser.bind(supabase.auth);
            supabase.auth.getUser = async () => {
                const result = await originalGetUser();
                if (result.data.user) return result; // valid real user

                // otherwise return mock
                return {
                    data: {
                        user: {
                            id: 'dev-user-id',
                            email: 'testuser@gmail.com',
                            role: 'authenticated',
                            aud: 'authenticated',
                            app_metadata: { provider: 'email' },
                            user_metadata: {},
                            created_at: new Date().toISOString(),
                            email_confirmed_at: new Date().toISOString(),
                        } as any
                    },
                    error: null
                };
            }
        }
    }

    return supabase
}
