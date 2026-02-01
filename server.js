import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = config.PORT || 3001;

const apiKey = config.GEMINI_API_KEY;
if (!apiKey) {
    console.error('CRITICAL ERROR: API_KEY is not defined in config.js');
} else {
    console.log(`API Key loaded from config.js (len: ${apiKey.length}): ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(apiKey);

app.post('/api/gemini', async (req, res) => {
    const { model: modelName, contents, systemInstruction, generationConfig } = req.body;

    try {
        const model = genAI.getGenerativeModel({
            model: modelName || 'gemini-1.5-flash',
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent({
            contents,
            generationConfig
        });

        const response = await result.response;
        res.json(response);
    } catch (error) {
        console.error('Gemini Proxy Error:', error);
        res.status(500).json({ error: error.message });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Gemini Proxy running on http://localhost:${port}`);
});
