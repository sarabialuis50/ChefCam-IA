import { GoogleGenAI } from "@google/genai";

async function list() {
    const genAI = new GoogleGenAI({ apiKey: "AIzaSyC7GqL8xm7Ax3k_P84ubHNJwo-eZar4zl4" });
    try {
        const response = await genAI.models.list();
        console.log("RESPONSE STRUCTURE:", Object.keys(response));
        if (response.models) {
            console.log("MODEL NAMES:", response.models.map(m => m.name));
        } else {
            console.log("RESPONSE:", JSON.stringify(response, null, 2));
        }
    } catch (e) {
        console.error("LIST MODELS ERROR:", e.message);
    }
}
list();
