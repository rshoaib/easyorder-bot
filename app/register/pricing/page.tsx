'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Get tenantId from URL (passed after registration)
  const tenantId = searchParams.get('tenantId');
  const canceled = searchParams.get('canceled');

  const handleSubscribe = async () => {
    if (!tenantId) {
        alert("No Store ID found. Please register first.");
        return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            tenantId,
            // variantId will be pulled from env on server if not passed
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Choose your plan
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start your digital restaurant today.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {canceled && (
             <div className="mb-4 bg-yellow-50 p-4 rounded-md text-sm text-yellow-700 text-center">
                Checkout canceled. No worries, you can try again below.
             </div>
        )}

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-2 border-blue-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 uppercase font-bold">
                Recommended
            </div>
            
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Pro Plan</h3>
                <div className="mt-4 flex justify-center items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900">$15</span>
                    <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                </div>
                <p className="mt-4 text-gray-500 text-sm">Everything you need to run your store.</p>
            </div>

            <ul className="mt-6 space-y-4">
                {['Unlimited Orders', 'Kitchen Display System', 'Custom Domain Support', 'Priority Support'].map((feature) => (
                    <li key={feature} className="flex items-start">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-8">
                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Subscribe to Pro'}
                </button>
            </div>
        </div>
        
        <div className="mt-6 text-center">
            <button onClick={() => router.push('/admin/dashboard')} className="text-sm text-gray-500 hover:text-gray-900">
                Skip for now (Demo Mode)
            </button>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>}>
            <PricingContent />
        </Suspense>
    );
}
