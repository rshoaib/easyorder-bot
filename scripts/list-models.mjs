import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

const resp = await fetch(url);
const data = await resp.json();

if (data.models) {
    const lines = [];
    // Filter for models with "image" in name or that support generateContent
    const imageModels = data.models.filter(m => {
        const name = m.name.toLowerCase();
        return name.includes('image') || name.includes('2.5') || name.includes('2.0');
    });

    lines.push('Image-capable models (' + imageModels.length + '):');
    imageModels.forEach(m => {
        const methods = (m.supportedGenerationMethods || []).join(', ');
        lines.push('  ' + m.name + ' | ' + methods);
    });

    fs.writeFileSync('models.txt', lines.join('\n'), 'utf8');
    console.log('Done. Check models.txt');
}
