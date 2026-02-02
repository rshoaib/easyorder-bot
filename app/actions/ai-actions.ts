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
            You are a menu engineering expert.
            1. Analyze this business description: "${businessDescription}"
            2. Classify it into one of these types: "restaurant", "retail", "service", "digital".
            3. Create a list of 8 diverse and appealing items for this business.
            
            Return ONLY a valid JSON object with this structure:
            {
              "storeType": "restaurant" | "retail" | "service" | "digital",
              "items": [
                {
                  "name": "string",
                  "description": "string (under 120 chars)",
                  "price": number,
                  "category": "string"
                }
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Clean up markdown code blocks if present
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);

        if (!data.items || !Array.isArray(data.items)) {
            throw new Error("Invalid AI response format");
        }

        const inferredType = data.storeType || 'restaurant';
        // Map store type to product type
        let productType: 'physical' | 'digital' | 'service' = 'physical';
        if (inferredType === 'service') productType = 'service';
        if (inferredType === 'digital') productType = 'digital';

        const productRepo = getProductRepository();
        const tenantRepo = getTenantRepository();

        for (const item of data.items) {
            await productRepo.addProduct({
                id: crypto.randomUUID(),
                tenantId: tenant.id,
                name: item.name,
                description: item.description,
                price: Number(item.price),
                category: item.category,
                image: '', // Placeholder
                isAvailable: true,
                type: productType
            });
        }

        // Update Tenant Store Type
        await tenantRepo.updateTenantSettings(
            tenant.id,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            inferredType
        );

        revalidatePath(`/store/${slug}/menu`);
        revalidatePath(`/store/${slug}/admin`);

        return { success: true, count: data.items.length, type: inferredType };

    } catch (error: any) {
        console.error('Error generating menu:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Failed to generate menu.' };
    }
}
