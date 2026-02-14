'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyTenantOwnership } from "@/lib/auth/security";
import { getProductRepository, getTenantRepository } from "@/lib/repository";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const apiKey = process.env.GEMINI_API_KEY;

// Helper to get available models dynamically
async function getAvailableModels(apiKey: string): Promise<string[]> {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            // Prioritize flash models, then pro, then others
            const modelNames = data.models.map((m: any) => m.name.replace('models/', ''));
            return modelNames.sort((a: string, b: string) => {
                if (a.includes('flash') && !b.includes('flash')) return -1;
                if (!a.includes('flash') && b.includes('flash')) return 1;
                if (a.includes('pro') && !b.includes('pro')) return -1;
                if (!a.includes('pro') && b.includes('pro')) return 1;
                return 0;
            });
        }
    } catch (e) {
        console.error("Failed to fetch models dynamically:", e);
    }
    // Fallback if dynamic fetch fails
    return ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
}

// Helper to try multiple models
async function generateWithFallback(prompt: string, useJson: boolean = false) {
    if (!apiKey) throw new Error("Gemini API Key is not configured.");

    const genAI = new GoogleGenerativeAI(apiKey);

    // Get available models dynamically to avoid 404s on model names
    const availableModels = await getAvailableModels(apiKey);
    // Filter for generative models (usually start with gemini)
    const models = availableModels.filter(m => m.includes('gemini'));

    if (models.length === 0) {
        throw new Error("No Gemini models available for this API key.");
    }

    const errors: string[] = [];
    for (const modelName of models) {
        try {
            // Only use JSON mode if model supports it (usually 1.5+ or starts with gemini-1.5)
            // But we can try to apply it safely. 
            // Actually, responseMimeType is safer to apply on 1.5+ models only to avoid errors on older ones.
            const isJsonSupported = modelName.includes('1.5') || modelName.includes('2.0') || modelName.includes('2.5') || modelName.includes('flash');
            const config = (useJson && isJsonSupported) ? { responseMimeType: "application/json" } : undefined;

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: config
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (e: any) {
            console.warn(`Model ${modelName} failed:`, e.message);
            errors.push(`${modelName}: ${e.message}`);
        }
    }
    throw new Error(`[AI Failure]: All models failed. Details: ${errors.join(' | ')}`);
}

export async function generateProductDescription(name: string, category: string, storeContext?: { name: string, type: string }) {
    try {
        let prompt = `Write a short, appetizing, and professional food menu description (max 2 sentences) for a item named "${name}" which is in the category "${category}". Do not include quotes.`;

        if (storeContext) {
            prompt = `Context: A ${storeContext.type} store named "${storeContext.name}".
            Task: Write a short, enticing, and validation-ready description (max 2 sentences) for a product named "${name}" in the category "${category}".
            Tone: Professional yet appealing to customers of this specific business type.
            Constraint: Do not include quotes.`;
        }

        const text = await generateWithFallback(prompt, false);
        return { success: true, description: text.trim() };
    } catch (error: any) {
        console.error('Error generating description:', error);
        return { success: false, message: error.message || 'AI generation failed.' };
    }
}

export async function generateMenu(slug: string, businessDescription: string) {
    try {
        // Security Check
        const { tenant } = await verifyTenantOwnership(slug);

        const prompt = `
            You are a menu engineering expert.
            1. Analyze this business description: "${businessDescription}"
            2. Classify it into one of these types: "restaurant", "retail", "service", "digital".
            3. Create a list of 8 diverse and appealing items for this business.
            4. For each item, provide a single, specific, visual English keyword or short phrase (max 2 words) to use for an image search (e.g., "pepperoni pizza", "running shoes", "haircut", "ebook cover").

            Return ONLY a valid JSON object with this structure:
            {
              "storeType": "restaurant" | "retail" | "service" | "digital",
              "items": [
                {
                  "name": "string",
                  "description": "string (under 120 chars)",
                  "price": number,
                  "category": "string",
                  "imageKeyword": "string"
                }
              ]
            }
        `;

        let text = await generateWithFallback(prompt, true);

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse AI JSON response:", text);
            throw new Error("AI returned invalid data format.");
        }

        if (!data.items || !Array.isArray(data.items)) {
            console.error("Invalid data structure:", data);
            throw new Error("Invalid AI response format");
        }

        const inferredType = data.storeType || 'restaurant';
        // Map store type to product type
        let productType: 'physical' | 'digital' | 'service' = 'physical';
        if (inferredType === 'service') productType = 'service';
        if (inferredType === 'digital') productType = 'digital';

        const supabase = await createClient();
        const productRepo = getProductRepository(supabase);
        const tenantRepo = getTenantRepository(supabase);

        for (const item of data.items) {
            const keyword = encodeURIComponent(item.imageKeyword || item.name);
            const category = encodeURIComponent(item.category || 'food');
            const imageUrl = `https://loremflickr.com/600/400/${category},${keyword}/all`;

            await productRepo.addProduct({
                // Use Date.now + random for simple unique ID without crypto dependency requirement
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                tenantId: tenant.id,
                name: item.name,
                description: item.description,
                price: Number(item.price),
                category: item.category,
                image: imageUrl,
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
        return { success: false, message: error.message || 'Failed to generate menu.' };
    }
}

export async function generateCommentReply(comment: string, productName: string, storeContext?: { name: string, type: string }) {
    try {
        let context = "";
        if (storeContext) {
            context = `You are a helpful customer service AI for "${storeContext.name}", a ${storeContext.type} business.`;
        } else {
            context = `You are a helpful customer service AI.`;
        }

        const prompt = `
            ${context}
            Task: Write a short, friendly, and professional reply to this customer comment on our product "${productName}".
            Comment: "${comment}"
            Goal: Answer their question if any, thank them, and politely encourage them to order via the link in bio or post.
            Constraint: Keep it under 200 characters. No hashtags.
        `;

        const text = await generateWithFallback(prompt, false);
        return { success: true, reply: text.trim() };
    } catch (error: any) {
        console.error('Error generating reply:', error);
        return { success: false, message: error.message || 'AI generation failed.' };
    }
}
