"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Is it really free?",
    answer:
      "Yes — 100% free, forever. Unlimited products, unlimited orders, WhatsApp integration, custom branding — all included at no cost. The only thing we charge for is optional one-on-one customization help (a setup, custom feature, or design tweak), and that's only if you ask.",
  },
  {
    question: "Do I need any technical skills?",
    answer:
      "Not at all! If you can use WhatsApp, you can use OrderViaChat. Just type your store name, add your products (or let our AI generate them), and share the link. That's it.",
  },
  {
    question: "How do I receive orders?",
    answer:
      "When a customer places an order from your store, it arrives as a clean, formatted WhatsApp message on your phone. You see the items, quantities, customer name, and total — ready to fulfill.",
  },
  {
    question: "Can I customize my store's look?",
    answer:
      "Absolutely. You can add your logo, choose your brand color, upload a banner image, and organize products into categories. Your store will look and feel like your own brand.",
  },
  {
    question: "Is there a limit on products or orders?",
    answer:
      "No limits at all. Add as many products as you need and receive as many orders as your business can handle. We don't throttle or cap anything on the free plan.",
  },
  {
    question: "What types of businesses can use this?",
    answer:
      "Any business that takes orders! Restaurants, bakeries, home kitchens, clothing stores, barber shops, digital product sellers - if you sell something, OrderViaChat works for you.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-white border-indigo-200 shadow-lg shadow-indigo-500/5"
                : "bg-white border-slate-100 hover:border-slate-200"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
            >
              <span className="font-bold text-slate-900 text-[15px]">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-indigo-600" : ""
                }`}
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: isOpen ? "200px" : "0px",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
