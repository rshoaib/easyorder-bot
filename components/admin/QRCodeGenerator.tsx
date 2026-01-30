'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    url: string;
    storeName: string;
}

export default function QRCodeGenerator({ url, storeName }: Props) {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const svg = document.getElementById("qr-code-svg");
        if (!svg) return;
        
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width + 40; // Add padding
            canvas.height = img.height + 40;
            
            if (ctx) {
                // White background
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw QR
                ctx.drawImage(img, 20, 20);
                
                const pngFile = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.download = `${storeName}-qrcode.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };
        
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100" ref={qrRef}>
                    <QRCodeSVG 
                        id="qr-code-svg"
                        value={url} 
                        size={256}
                        level="H"
                        includeMargin={true}
                    />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scan to Order</h3>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Place this code on your tables. Customers can scan it with their camera to view your menu instantly.
                </p>

                <div className="flex gap-4 exclude-print">
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-200"
                    >
                        <Download size={20} /> Download PNG
                    </button>
                    {/* 
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        <Printer size={20} /> Print Flyer
                    </button>
                    */}
                </div>
            </div>
            
            {/* Printable Area (Hidden by default, shown on print) */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-20 text-center">
                <h1 className="text-6xl font-bold mb-8">MENU</h1>
                <div className="w-[500px] h-[500px] mx-auto border-4 border-black p-4 mb-8">
                     <QRCodeSVG value={url} size={450} level="H" />
                </div>
                <h2 className="text-4xl font-mono">{storeName}</h2>
                <p className="text-2xl mt-4 text-gray-600">Scan to order on WhatsApp</p>
            </div>
        </div>
    );
}
