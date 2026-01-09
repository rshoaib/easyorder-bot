'use client';

import { updateLanguage } from "@/app/store/[slug]/admin/settings-actions";
import { useTransition } from "react";
import { Globe, Loader2 } from "lucide-react";

export function LanguageSelector({ slug, currentLanguage }: { slug: string, currentLanguage: string }) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        startTransition(async () => {
            await updateLanguage(slug, newLang);
        });
    };

    return (
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            {isPending ? <Loader2 size={16} className="animate-spin text-gray-500"/> : <Globe size={16} className="text-gray-500"/>}
            <select 
                value={currentLanguage} 
                onChange={handleChange}
                disabled={isPending}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer disabled:opacity-50"
            >
                <option value="en">English 🇺🇸</option>
                <option value="es">Español 🇪🇸</option>
                <option value="fr">Français 🇫🇷</option>
            </select>
        </div>
    );
}
