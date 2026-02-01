import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
    const genAI = new GoogleGenerativeAI("AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4");
    try {
        const result = await genAI.listModels();
        console.log("Modelos disponibles:");
        for await (const model of result) {
            console.log("-", model.name);
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
listModels();
