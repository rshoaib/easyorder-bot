'use client';

import { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, RefreshCw, Type, Palette } from 'lucide-react';

interface Props {
    storeName: string;
    storeUrl: string;
    themeColor: string; // e.g., '#4F46E5'
    logoUrl?: string; // Optional URL to tenant logo
}

export default function SocialAssetGenerator({ storeName, storeUrl, themeColor, logoUrl }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [headline, setHeadline] = useState('Order Now');
    const [subheadline, setSubheadline] = useState('Link in Bio');
    const [accentColor, setAccentColor] = useState(themeColor || '#000000');
    const [bgStyle, setBgStyle] = useState<'solid' | 'gradient'>('gradient');

    // Draw the canvas whenever inputs change
    useEffect(() => {
        drawCanvas();
    }, [headline, subheadline, accentColor, bgStyle, storeName, storeUrl, logoUrl]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas Dimensions (Instagram Story Ratio 9:16 approx, but scaled down for UI)
        // We'll render at high res 1080x1920 but display smaller
        const width = 1080;
        const height = 1920;
        canvas.width = width;
        canvas.height = height;

        // 1. Background
        if (bgStyle === 'solid') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
        } else {
            // Gradient Background using Brand Color
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, `${accentColor}22`); // 22 is ~13% opacity hex
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Decor / Frame
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 20;
        ctx.strokeRect(40, 40, width - 80, height - 80);

        // 3. Text Configuration
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111827'; // Dark Gray Text

        // Headline
        ctx.font = 'bold 120px Inter, sans-serif';
        ctx.fillText(headline, width / 2, 500);

        // Subheadline
        ctx.font = '500 60px Inter, sans-serif';
        ctx.fillStyle = '#4B5563';
        ctx.fillText(subheadline, width / 2, 600);

        // Store Name (Bottom Branding)
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillStyle = accentColor;
        ctx.fillText(`@${storeName}`, width / 2, height - 150);

        // 4. Logo (Rounded Image) - Placeholder logic if no CORS logo
        // Drawing external images on canvas requires loading them first.
        // For simplicity in MVP, we might skip the logo if it's external/CORS restricted,
        // or just draw a circle with initials.
        
        ctx.beginPath();
        ctx.arc(width / 2, 250, 100, 0, Math.PI * 2, true);
        ctx.fillStyle = `${accentColor}20`; // Light circle
        ctx.fill();
        
        ctx.font = 'bold 80px Inter, sans-serif';
        ctx.fillStyle = accentColor;
        ctx.fillText(storeName.substring(0, 2).toUpperCase(), width / 2, 280);

        // 5. QR Code
        // We render the React Component hidden, then draw it onto the main canvas
        const qrCanvas = document.getElementById('hidden-qr-code') as HTMLCanvasElement;
        if (qrCanvas) {
            ctx.drawImage(qrCanvas, (width - 600) / 2, 800, 600, 600);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `story-${storeName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-8">
            {/* Controls */}
            <div className="flex-1 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Palette size={20} className="text-pink-500" />
                        Story Generator
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Create instant social media assets.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            placeholder="e.g. New Arrivals"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub-headline</label>
                        <input
                            type="text"
                            value={subheadline}
                            onChange={(e) => setSubheadline(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            placeholder="e.g. Link in Bio"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Style</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setBgStyle('gradient')}
                                className={`px-3 py-1 rounded text-sm border ${bgStyle === 'gradient' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-gray-50'}`}
                            >
                                Gradient
                            </button>
                            <button
                                onClick={() => setBgStyle('solid')}
                                className={`px-3 py-1 rounded text-sm border ${bgStyle === 'solid' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-gray-50'}`}
                            >
                                Minimal White
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <Download size={18} /> Download Story
                </button>
                
                <p className="text-xs text-gray-400 text-center">
                    Downloads a high-res (1080x1920) PNG optimized for Instagram/TikTok/WhatsApp Status.
                </p>
            </div>

            {/* Preview */}
            <div className="flex-1 flex justify-center bg-gray-50 p-4 rounded-xl items-center relative">
                {/* Visual Preview (Scale down the big canvas via CSS) */}
                <canvas 
                    ref={canvasRef} 
                    className="shadow-xl rounded-lg max-h-[500px] w-auto h-auto object-contain bg-white"
                    style={{ aspectRatio: '9/16' }}
                />

                {/* Hidden QR Code source for the canvas to copy from */}
                <div className="absolute opacity-0 pointer-events-none">
                     <QRCodeCanvas
                        id="hidden-qr-code"
                        value={storeUrl}
                        size={600}
                        bgColor={"#ffffff"}
                        fgColor={accentColor}
                        level={"H"}
                        includeMargin={false}
                    />
                </div>
            </div>
        </div>
    );
}
