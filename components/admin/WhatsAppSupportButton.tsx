"use client";

import { useState, useEffect, useRef } from "react";

interface SupportLabels {
  title: string;
  help: string;
  helpDesc: string;
  custom: string;
  customDesc: string;
}

const WHATSAPP_ICON_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

export default function WhatsAppSupportButton({
  storeName,
  labels,
}: {
  storeName: string;
  labels: SupportLabels;
}) {
  const [open, setOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const phoneNumber = "923224609117";
  const helpMessage = encodeURIComponent(`Hi, I need help with my store: ${storeName}`);
  const customMessage = encodeURIComponent(
    `Hi, I'd like to discuss customization for my store: ${storeName}. I've seen the options at https://orderviachat.com/services`
  );
  const helpUrl = `https://wa.me/${phoneNumber}?text=${helpMessage}`;
  const customUrl = `https://wa.me/${phoneNumber}?text=${customMessage}`;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      {/* Popover */}
      {open && (
        <div className="absolute bottom-16 right-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-2 pt-1 pb-2 text-sm font-semibold text-gray-900">
            {labels.title}
          </div>

          <a
            href={helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors no-underline"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                <path d={WHATSAPP_ICON_PATH} />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{labels.help}</div>
              <div className="text-xs text-gray-500 leading-snug">{labels.helpDesc}</div>
            </div>
          </a>

          <a
            href={customUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors no-underline"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{labels.custom}</div>
              <div className="text-xs text-gray-500 leading-snug">{labels.customDesc}</div>
            </div>
          </a>
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={labels.title}
        className="relative group"
      >
        {isPulsing && !open && (
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
        )}
        <div className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-7 h-7"
          >
            <path d={WHATSAPP_ICON_PATH} />
          </svg>
        </div>
      </button>
    </div>
  );
}
