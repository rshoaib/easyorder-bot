'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

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
