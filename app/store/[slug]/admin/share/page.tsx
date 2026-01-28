"use client";

import { use, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import StoryPreview from '@/components/admin/StoryPreview';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default function SharePage({ params }: Props) {
    // Unwrap params using React.use()
    const { slug } = use(params);
    
    const [storeUrl, setStoreUrl] = useState('');
    const [storeName, setStoreName] = useState('');
    const [themeColor, setThemeColor] = useState('#10b981');
    const [activeTab, setActiveTab] = useState<'qr' | 'social'>('qr');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Fetch tenant details to get the custom domain if available
        // For now, we'll construct the default URL and fetch the name
        // Ideally this data should be passed from the server or fetched via API
        // But for this client component, we'll do a quick fetch
        
        async function fetchStoreDetails() {
            try {
                // We're essentially fetching the same data as the layout
                // In a real app we might pass this down or use a context
                // For now, we'll just reconstruct the basic URL
                // If you have an API to get tenant details by slug, call it here
                
                // Construct default URL
                const baseUrl = window.location.origin;
                const url = `${baseUrl}/store/${slug}`;
                setStoreUrl(url);

                // Fetch store name could be done here if we had an API endpoint for public store info
                // Or we can rely on what we can infer. 
                // Let's default to slug for now or fetch if we add an endpoint later.
                // Actually, let's just use the slug formatted nicely as a placeholder or fetch from an API
                 const response = await fetch(`/api/store/${slug}`);
                 if (response.ok) {
                     const data = await response.json();
                     if (data.tenant) {
                         setStoreName(data.tenant.name);
                         if (data.tenant.customDomain) {
                             setStoreUrl(`https://${data.tenant.customDomain}`);
                         }
                     }
                 }
            } catch (error) {
                console.error("Failed to fetch store details", error);
                const baseUrl = window.location.origin;
                setStoreUrl(`${baseUrl}/store/${slug}`);
            }
        }

        fetchStoreDetails();
    }, [slug]);

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const svg = document.getElementById('qr-code-svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `${slug}-qrcode.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    if (!storeUrl) return <div className="p-8">Loading...</div>;

    return (
        <main className="container mx-auto p-4 md:p-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Share Store</h1>
                    <p className="text-gray-500">Generate QR codes for your packaging and marketing materials.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('qr')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'qr' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Standard QR Code
                </button>
                <button 
                    onClick={() => setActiveTab('social')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'social' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Smartphone size={16} /> Social Media Story
                </button>
            </div>

            {activeTab === 'qr' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Standard QR Code Content (Existing) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center print:shadow-none print:border-none print:p-0 print:w-full">
                        <div className="mb-6 print:mb-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{storeName || slug}</h2>
                            <p className="text-gray-500 text-sm">Scan to order on WhatsApp</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl border-2 border-gray-900 mb-6 print:mb-4">
                            <QRCodeSVG 
                                id="qr-code-svg"
                                value={storeUrl} 
                                size={256}
                                level="H"            
                                includeMargin={true}
                            />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1.5 rounded-lg mb-6 print:hidden">
                            {storeUrl}
                            <button onClick={handleCopy} className="hover:text-indigo-600 transition-colors">
                                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                            </button>
                        </div>

                        {/* Print-only footer */}
                        <div className="hidden print:block text-center mt-4">
                            <p className="text-sm text-gray-500">Powered by OrderViaChat</p>
                        </div>
                    </div>

                    {/* Actions Panel (Hidden when printing) */}
                    <div className="space-y-6 print:hidden">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={handlePrint}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                            <Printer size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">Print QR Code</div>
                                            <div className="text-xs text-gray-500">Perfect for stickers and packaging</div>
                                        </div>
                                    </div>
                                </button>

                                <button 
                                    onClick={handleDownload}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors">
                                            <Download size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">Download SVG</div>
                                            <div className="text-xs text-gray-500">High quality vector format</div>
                                        </div>
                                    </div>
                                </button>

                                <a 
                                    href={storeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 transition-colors">
                                            <ExternalLink size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-900">Open Store</div>
                                            <div className="text-xs text-gray-500">Test the link yourself</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-2">Marketing Tip</h3>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Print this QR code and stick it on every delivery box. Add a call to action like <strong>"Scan to verify order"</strong> or <strong>"Get 10% off next order"</strong> to encourage customers to use your direct channel.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <StoryPreview 
                        storeName={storeName || slug} 
                        storeUrl={storeUrl} 
                        themeColor={themeColor}
                    />
                </div>
            )}

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body * {
                        visibility: hidden;
                    }
                    main {
                        padding: 0;
                        margin: 0;
                        width: 100%;
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    /* Show only the Preview Card content */
                    .container, .container > div {
                        visibility: visible;
                    }
                    /* But hide the siblings of the preview card (Actions Panel) explicitly if needed, although visibility hidden on body should catch parents */
                    
                    /* Better approach for print: target the specific wrapper */
                     main > div {
                        display: block; /* Override grid */
                    }
                    
                    /* Hide everything */
                    body > * {
                        display: none;
                    }
                    
                    /* Show main and its children */
                    body > div:has(main), body > main {
                        display: block;
                        visibility: visible;
                    }

                    main * {
                        visibility: visible;
                    }

                    /* Hide the actions column */
                    main > div > div:last-child {
                        display: none;
                    }
                    
                    /* Center the card */
                    main > div > div:first-child {
                        width: 100%;
                        border: none;
                        box-shadow: none;
                    }
                }
            `}</style>
        </main>
    );
}
