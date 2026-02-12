
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function getAvailableModels(apiKey) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            const modelNames = data.models.map(m => m.name.replace('models/', ''));
            return modelNames.sort((a, b) => {
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
    return [];
}

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key");
        return;
    }

    console.log("1. Fetching available models...");
    const available = await getAvailableModels(apiKey);
    console.log("Available models:", available);

    const models = available.filter(m => m.includes('gemini'));
    if (models.length === 0) {
        console.error("No Gemini models found.");
        return;
    }

    console.log(`2. Attempting generation with '${models[0]}'...`);
    
    // Simulate fallback logic
    const genAI = new GoogleGenerativeAI(apiKey);
    const errors = [];
    
    for (const modelName of models) {
        try {
            console.log(`Trying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you working?");
            const response = await result.response;
            const text = response.text();
            console.log("✅ Success!");
            console.log("Output:", text);
            return;
        } catch (e) {
            console.warn(`❌ Model ${modelName} failed:`, e.message);
            errors.push(`${modelName}: ${e.message}`);
        }
    }
    console.error("All models failed:", errors);
}

run();
