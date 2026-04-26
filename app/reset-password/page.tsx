'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getTenantBySlug } from './actions';

/**
 * /reset-password
 *
 * Landing page for the Supabase password-recovery flow. The user clicks
 * the recovery link emailed to them; Supabase verifies the token and
 * lands them here with a "recovery" session. We let them choose a new
 * password and call supabase.auth.updateUser({ password }) to persist it,
 * then send them to their admin dashboard (or /login if we can't resolve
 * a tenant for them).
 *
 * If a logged-out user arrives here directly without a recovery session,
 * we explain and link back to /login so they can request a fresh link.
 */
export default function ResetPasswordPage() {
    const router = useRouter();
    const supabase = createClient();

    const [checking, setChecking] = useState(true);
    const [hasSession, setHasSession] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    // On mount, confirm the user landed here with a valid session
    // (Supabase exchanged the recovery token before redirecting here).
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (cancelled) return;
            setHasSession(!!user);
            setEmail(user?.email ?? null);
            setChecking(false);
        })();
        return () => {
            cancelled = true;
        };
    }, [supabase]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            const { error: updateErr } = await supabase.auth.updateUser({ password });
            if (updateErr) throw updateErr;
            setDone(true);

            // Try to send them to their store admin; fall back to /login.
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const tenantSlug = await getTenantBySlug(user.id).catch(() => null);
                setTimeout(() => {
                    router.push(tenantSlug ? `/store/${tenantSlug}/admin` : '/login');
                }, 1500);
            } else {
                setTimeout(() => router.push('/login'), 1500);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to update password';
            setError(msg);
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="text-center mb-7">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <Lock size={22} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Set a new password</h1>
                    {email && (
                        <p className="text-sm text-slate-500 mt-1">
                            for <span className="font-medium text-slate-700">{email}</span>
                        </p>
                    )}
                </div>

                {checking && (
                    <div className="flex items-center justify-center py-10 text-slate-400">
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Verifying your link...
                    </div>
                )}

                {!checking && !hasSession && (
                    <div className="text-center py-6">
                        <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-3 text-left mb-4">
                            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                            <span>
                                This password reset link is invalid or has expired. Please
                                request a new one from the login page.
                            </span>
                        </div>
                        <a
                            href="/login"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl"
                        >
                            Back to login
                        </a>
                    </div>
                )}

                {!checking && hasSession && !done && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                New password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                required
                                minLength={8}
                                autoFocus
                                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Confirm new password
                            </label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Re-enter password"
                                required
                                minLength={8}
                                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            Update password
                        </button>
                    </form>
                )}

                {done && (
                    <div className="text-center py-6">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 size={24} />
                        </div>
                        <p className="font-bold text-slate-900">Password updated.</p>
                        <p className="text-sm text-slate-500 mt-1">Taking you to your store…</p>
                    </div>
                )}
            </div>
        </div>
    );
}
