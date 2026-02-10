
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("NO_KEY");
    return;
  }
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
        console.log("API_ERROR: " + JSON.stringify(data.error));
    } else if (data.models) {
        data.models.forEach(m => console.log(m.name.replace('models/', '')));
    } else {
        console.log("UNEXPECTED: " + JSON.stringify(data));
    }

  } catch (error) {
    console.log("SCRIPT_ERROR: " + error.message);
  }
}

checkModels();
