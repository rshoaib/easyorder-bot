'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { createStore } from './actions';

interface Props {
    onClose: () => void;
}

export default function CreateStoreDialog({ onClose }: Props) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const firstFieldRef = useRef<HTMLInputElement>(null);

    // Focus first field on mount + close on Escape
    useEffect(() => {
        firstFieldRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    function handleSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            try {
                await createStore(formData);
                onClose();
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Failed to create store';
                setError(msg);
            }
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm flex items-stretch justify-end"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 h-14 border-b border-zinc-200">
                    <h2 className="font-semibold text-zinc-900">New store</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form id="create-store-form" action={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                    <Field
                        label="Store name"
                        name="name"
                        placeholder="Pizza Palace"
                        required
                        inputRef={firstFieldRef}
                    />
                    <Field
                        label="Owner email"
                        name="email"
                        type="email"
                        placeholder="owner@example.com"
                        required
                    />
                    <Field
                        label="URL slug"
                        name="slug"
                        placeholder="pizza-palace"
                        helper="Will appear at /store/<slug>. Lowercase letters, numbers and hyphens only."
                        required
                    />
                    <Field
                        label="Login password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        helper="Owner uses this to log in. They can change it later."
                        required
                    />

                    {error && (
                        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </form>

                <div className="border-t border-zinc-200 px-6 py-4 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 px-3 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition"
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-store-form"
                        disabled={isPending}
                        className="h-9 px-4 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition inline-flex items-center gap-2 disabled:opacity-60"
                    >
                        {isPending && <Loader2 size={14} className="animate-spin" />}
                        Create store
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Tiny field primitive ───────────────────────────────────────────────────

interface FieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    helper?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}

function Field({ label, name, type = 'text', placeholder, required, helper, inputRef }: FieldProps) {
    return (
        <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">{label}</label>
            <input
                ref={inputRef}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 outline-none transition"
            />
            {helper && <p className="text-xs text-zinc-400 mt-1.5">{helper}</p>}
        </div>
    );
}
