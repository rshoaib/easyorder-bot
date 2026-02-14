"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Plus, Check, Send } from "lucide-react";

const DEMO_PRODUCTS = [
  { name: "Classic Burger", price: "10.00", emoji: "🍔", category: "Burgers" },
  { name: "Margherita Pizza", price: "12.00", emoji: "🍕", category: "Pizza" },
  { name: "Iced Latte", price: "4.50", emoji: "☕", category: "Drinks" },
];

export default function HeroDemo() {
  const [step, setStep] = useState(0); // 0=store, 1=adding, 2=whatsapp
  const [addedItems, setAddedItems] = useState<number[]>([]);

  // Auto-play animation cycle
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Step 1: Add first item after 1.5s
    timers.push(setTimeout(() => setAddedItems([0]), 1500));
    // Step 2: Add second item after 2.5s
    timers.push(setTimeout(() => setAddedItems([0, 1]), 2500));
    // Step 3: Show WhatsApp message after 3.5s
    timers.push(setTimeout(() => setStep(1), 3800));
    // Step 4: Reset after 7s
    timers.push(
      setTimeout(() => {
        setStep(0);
        setAddedItems([]);
      }, 7500)
    );

    // Loop the animation
    const interval = setInterval(() => {
      setStep(0);
      setAddedItems([]);

      timers.push(setTimeout(() => setAddedItems([0]), 1500));
      timers.push(setTimeout(() => setAddedItems([0, 1]), 2500));
      timers.push(setTimeout(() => setStep(1), 3800));
      timers.push(
        setTimeout(() => {
          setStep(0);
          setAddedItems([]);
        }, 7500)
      );
    }, 8000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      {/* Phone frame */}
      <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl shadow-slate-900/30">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-slate-50 px-5 py-2 flex justify-between items-center text-[10px] text-slate-400 font-medium">
            <span>9:41</span>
            <div className="w-20 h-5 bg-slate-900 rounded-full mx-auto" />
            <span>100%</span>
          </div>

          {/* Store header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm">
                🍔
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">
                  Riz&apos;s Burgers
                </div>
                <div className="text-[10px] text-slate-400">
                  orderviachat.com
                </div>
              </div>
            </div>
            <div className="relative">
              <ShoppingBag size={16} className="text-slate-600" />
              {addedItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                  {addedItems.length}
                </span>
              )}
            </div>
          </div>

          {/* Product list or WhatsApp preview */}
          <div className="min-h-[260px] relative">
            {step === 0 ? (
              <div className="p-3 space-y-2">
                {DEMO_PRODUCTS.map((product, i) => {
                  const isAdded = addedItems.includes(i);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 transition-all duration-300"
                      style={{
                        opacity: 1,
                        transform: "translateX(0)",
                        animation: `slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms both`,
                      }}
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm shrink-0">
                        {product.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[11px] text-slate-800 truncate">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {product.category}
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          ${product.price}
                        </span>
                        <button
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isAdded
                              ? "bg-green-500 scale-110"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                        >
                          {isAdded ? (
                            <Check
                              size={12}
                              className="text-white"
                              strokeWidth={3}
                            />
                          ) : (
                            <Plus
                              size={12}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* WhatsApp message preview */
              <div
                className="p-4 bg-[#e5ddd5] min-h-[260px] flex flex-col justify-end"
                style={{
                  animation:
                    "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                }}
              >
                <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm max-w-[85%]">
                  <div className="text-[11px] text-slate-700 space-y-1">
                    <div className="font-bold text-green-700">
                      📋 New Order!
                    </div>
                    <div>1x Classic Burger — $10.00</div>
                    <div>1x Margherita Pizza — $12.00</div>
                    <div className="pt-1 border-t border-slate-100 mt-1 font-bold">
                      Total: $22.00
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-400 text-right mt-1">
                    9:42 AM ✓✓
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 bg-white rounded-full px-3 py-2 text-[10px] text-slate-400">
                    Type a message...
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Send size={12} className="text-white ml-0.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating labels */}
      <div
        className="absolute -left-4 md:-left-16 top-16 bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-100 hidden md:flex items-center gap-2"
        style={{
          animation: "float 6s ease-in-out infinite",
        }}
      >
        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs">
          ⚡
        </div>
        <span className="text-xs font-bold text-slate-700">2-min setup</span>
      </div>

      <div
        className="absolute -right-4 md:-right-16 bottom-24 bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-100 hidden md:flex items-center gap-2"
        style={{
          animation: "float 6s ease-in-out infinite 2s",
        }}
      >
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">
          💰
        </div>
        <span className="text-xs font-bold text-slate-700">$0 forever</span>
      </div>
    </div>
  );
}
