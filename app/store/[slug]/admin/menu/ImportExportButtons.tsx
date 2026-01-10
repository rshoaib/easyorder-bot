'use client';

import { Download, Upload, Loader2 } from 'lucide-react';
import { Product } from '@/lib/repository/types';
import { importProducts } from './actions';
import { useState } from 'react';

interface Props {
    slug: string;
    products: Product[];
}

export default function ImportExportButtons({ slug, products }: Props) {
    const [isImporting, setIsImporting] = useState(false);

    const handleExport = () => {
        // Simple CSV generation
        const headers = ['name', 'category', 'price', 'description', 'image', 'isAvailable'];
        const rows = products.map(p => [
            `"${p.name.replace(/"/g, '""')}"`,
            `"${p.category.replace(/"/g, '""')}"`,
            p.price,
            `"${(p.description || '').replace(/"/g, '""')}"`,
            `"${p.image}"`,
            p.isAvailable
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `menu-${slug}-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const text = await file.text();
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim()); // Assume name, category, price...
            
            // Basic parser (assumes standard CSV, might fail on complex quoted strings but ok for MVP)
            const newProducts: any[] = [];
            
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                // Very naive split, works for simple exports. 
                // Creating a robust CSV parser logic is complex without a lib like PapaParse.
                // Let's use a regex that handles quotes reasonably well for this use case.
                const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                // Actually, let's keep it extremely simple: strict format required. 
                // Or better: use a tiny parser helper.
                
                // Let's try to match: 
                // name, category, price, description, image, isAvailable
                // This is risky without a library. 
                
                // Plan B: Just tell user to avoid commas in fields if possible, or use a proper lib?
                // I'll try to use a simple quote-aware split.
                const row = parseCSVLine(lines[i]);
                if (row.length < 3) continue; // Skip bad lines

                newProducts.push({
                    name: row[0],
                    category: row[1],
                    price: parseFloat(row[2]) || 0,
                    description: row[3] || '',
                    image: row[4] || 'https://placehold.co/400',
                    isAvailable: row[5] === 'true'
                });
            }

            if (newProducts.length > 0) {
                await importProducts(slug, newProducts);
                alert(`Successfully imported ${newProducts.length} items!`);
            }

        } catch (error) {
            console.error(error);
            alert('Failed to import menu. Check CVS format.');
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    // Helper to handle "quoted strings"
    const parseCSVLine = (line: string) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.replace(/^"|"$/g, '').replace(/""/g, '"'));
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.replace(/^"|"$/g, '').replace(/""/g, '"'));
        return result;
    }

    return (
        <div className="flex gap-2">
            <button 
                onClick={handleExport}
                className="btn-secondary flex items-center gap-2 bg-white border-gray-200 text-gray-700"
            >
                <Download size={16} /> Export CSV
            </button>
            
            <label className="btn-secondary flex items-center gap-2 bg-indigo-50 border-indigo-100 text-indigo-600 cursor-pointer hover:bg-indigo-100">
                {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {isImporting ? 'Importing...' : 'Import CSV'}
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleImport} 
                    className="hidden" 
                    disabled={isImporting}
                />
            </label>
        </div>
    );
}
