
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ No API Key found");
    return;
  }
  
  console.log("Checking models for key:", apiKey.substring(0, 5) + "...");
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // There isn't a direct listModels on the client in some versions, 
    // but we can try to hit the REST endpoint if the SDK doesn't expose it easily 
    // or use the model manager if available. 
    // Actually, checking standard fetch to list models.
    
    // The SDK doesn't always expose listModels in the main entry. 
    // Let's use a raw fetch to the API endpoint to be sure.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
        console.error("❌ API Error:", data.error);
    } else if (data.models) {
        console.log("✅ Available Models:");
        data.models.forEach(m => console.log(` - ${m.name} (${m.supportedGenerationMethods?.join(', ')})`));
    } else {
        console.log("❓ Unexpected response:", data);
    }

  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

checkModels();
