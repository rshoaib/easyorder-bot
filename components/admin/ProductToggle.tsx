'use client';

import { useState } from 'react';
import { toggleProductAvailability } from '@/app/actions/product-actions';

interface Props {
  id: string;
  initialAvailable: boolean;
  slug: string;
}

export default function ProductToggle({ id, initialAvailable, slug }: Props) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Optimistic update
    const newState = !isAvailable;
    setIsAvailable(newState);

    try {
      await toggleProductAvailability(id, isAvailable, slug);
    } catch (e) {
      // Revert on error
      setIsAvailable(!newState);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
        <button 
            onClick={handleToggle}
            disabled={isLoading}
            className={`
                relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                ${isAvailable ? 'bg-indigo-600' : 'bg-gray-200'}
            `}
            title={isAvailable ? "Mark as Sold Out" : "Mark as Available"}
        >
            <span 
                className={`
                    absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform
                    ${isAvailable ? 'translate-x-5' : 'translate-x-0'}
                `} 
            />
        </button>
        <span className="text-[10px] font-medium text-gray-400">
            {isAvailable ? 'In Stock' : 'Sold Out'}
        </span>
    </div>
  );
}
