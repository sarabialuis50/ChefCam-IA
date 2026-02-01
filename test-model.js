import { GoogleGenAI } from "@google/genai";

async function test() {
    const genAI = new GoogleGenAI({ apiKey: "AIzaSyC7GqL8xm7Ax3k_P84ubHNJwo-eZar4zl4" });
    try {
        const response = await genAI.models.generateContent({
            model: "gemini-pro",
            contents: [{ role: "user", parts: [{ text: "Hola" }] }]
        });
        console.log("SUCCESS:", response.text);
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
test();
