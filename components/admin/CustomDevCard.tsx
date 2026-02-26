import { MessageCircle, Code2, Smartphone, Globe, Bot, Rocket } from 'lucide-react';

const WHATSAPP_URL = `https://wa.me/923224609117?text=${encodeURIComponent("Hi! I have a store on OrderViaChat but need a custom app/solution. Can you help?")}`;

export default function CustomDevCard() {
    return (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-2xl p-6 mb-6 overflow-hidden relative">
            {/* Decorative */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl" />
            <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-purple-200/30 rounded-full blur-xl" />

            <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Rocket size={16} className="text-white" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-base">Need a Custom Solution?</h3>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Don&apos;t have time to set up? Or need something beyond a store? We build custom solutions at <strong className="text-indigo-700">amazingly discounted rates</strong>.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/70 rounded-lg px-3 py-2">
                        <Globe size={14} className="text-blue-500 shrink-0" /> Web Apps
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/70 rounded-lg px-3 py-2">
                        <Smartphone size={14} className="text-purple-500 shrink-0" /> Mobile Apps
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/70 rounded-lg px-3 py-2">
                        <Bot size={14} className="text-green-500 shrink-0" /> WhatsApp Bots
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/70 rounded-lg px-3 py-2">
                        <Code2 size={14} className="text-amber-500 shrink-0" /> E-commerce
                    </div>
                </div>

                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-5 rounded-xl shadow-md shadow-green-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-sm"
                >
                    <MessageCircle size={16} />
                    Chat with Us — Free Consultation
                </a>
            </div>
        </div>
    );
}
