'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyTenantOwnership } from "@/lib/auth/security";
import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { revalidatePath } from "next/cache";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateProductDescription(name: string, category: string) {
    if (!apiKey) {
        return { success: false, message: 'Gemini API Key is not configured.' };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Write a short, appetizing, and professional food menu description (max 2 sentences) for a item named "${name}" which is in the category "${category}". Do not include quotes.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, description: text.trim() };
    } catch (error) {
        console.error('Error generating description:', error);
        return { success: false, message: 'AI generation failed. Please try again.' };
    }
}

export async function generateMenu(slug: string, businessDescription: string) {
    if (!apiKey) {
        return { success: false, message: 'Gemini API Key is not configured.' };
    }

    try {
        // Security Check
        const { tenant } = await verifyTenantOwnership(slug);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
            You are a menu engineering expert. Create a list of 8 diverse and appealing menu items for a business described as: "${businessDescription}".
            
            Return ONLY a valid JSON array of objects. Do not include markdown formatting like \`\`\`json.
            Each object should have:
            - name: string (creative name)
            - description: string (appetizing, under 120 chars)
            - price: number (realistic price in USD, just the number)
            - category: string (e.g. "Mains", "Drinks", "Dessert")
            
            Example: [{"name": "Classic Burger", "description": "Juicy beef patty...", "price": 12.5, "category": "Mains"}]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        const menuItems = JSON.parse(text);

        if (!Array.isArray(menuItems) || menuItems.length === 0) {
            throw new Error("Invalid AI response format");
        }

        const productRepo = getProductRepository();

        for (const item of menuItems) {
            await productRepo.addProduct({
                id: crypto.randomUUID(),
                tenantId: tenant.id,
                name: item.name,
                description: item.description,
                price: Number(item.price),
                category: item.category,
                image: '', // Placeholder
                isAvailable: true,
                type: 'physical'
            });
        }

        revalidatePath(`/store/${slug}/menu`);
        revalidatePath(`/store/${slug}/admin`);

        return { success: true, count: menuItems.length };

    } catch (error: any) {
        console.error('Error generating menu:', error);
        return { success: false, message: error.message || 'Failed to generate menu.' };
    }
}
