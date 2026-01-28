'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Check, RefreshCw } from 'lucide-react';

interface Props {
    storeName: string;
    storeUrl: string;
    themeColor?: string;
    currency?: string;
}

export default function StoryPreview({ storeName, storeUrl, themeColor = '#10b981', currency = '$' }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleDownload = async () => {
        if (!ref.current || downloading) return;
        setDownloading(true);

        try {
            // Need to double the size for better quality on retina/phones
            const dataUrl = await toPng(ref.current, { 
                cacheBust: true,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `story-${storeName.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
        } catch (err) {
            console.error('Failed to generate image', err);
            alert('Could not generate image. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* The Story Canvas (9:16 Aspect Ratio) */}
            <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                <div 
                    ref={ref}
                    className="relative overflow-hidden flex flex-col items-center justify-between text-center"
                    style={{
                        width: '320px',
                        height: '568px', // 9:16 approximation for preview
                        background: `linear-gradient(135deg, ${themeColor} 0%, #111827 100%)`, 
                        color: 'white',
                        padding: '40px 24px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Header */}
                    <div className="z-10 mt-8">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block border border-white/20">
                            Order Online
                        </div>
                        <h1 className="text-3xl font-bold leading-tight drop-shadow-lg">
                            {storeName}
                        </h1>
                    </div>

                    {/* QR Code */}
                    <div className="z-10 bg-white p-4 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <QRCodeSVG 
                            value={storeUrl} 
                            size={180}
                            level="H"            
                            includeMargin={false}
                        />
                    </div>

                    {/* Footer Call to Action */}
                    <div className="z-10 mb-8 w-full">
                        <p className="text-lg font-medium mb-3 opacity-90">Scan to view menu & order</p>
                        <div className="bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center gap-2 mx-auto w-full max-w-[200px]">
                            <span>👉 Link in Bio</span>
                        </div>
                        <p className="mt-4 text-xs opacity-50 font-mono">{storeUrl.replace('https://', '')}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <button 
                onClick={handleDownload}
                disabled={downloading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                    downloaded ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-900 hover:bg-gray-800'
                }`}
            >
                {downloading ? (
                    <><RefreshCw className="animate-spin" size={20} /> Generating...</>
                ) : downloaded ? (
                    <><Check size={20} /> Saved!</>
                ) : (
                    <><Download size={20} /> Download for Instagram</>
                )}
            </button>
            <p className="text-sm text-gray-500 max-w-xs text-center">
                Download and post this to your Instagram Story or WhatsApp Status.
            </p>
        </div>
    );
}
