import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
    const genAI = new GoogleGenerativeAI("AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Di 'Conexión exitosa' en español");
        const response = await result.response;
        console.log("✅ ÉXITO:", response.text());
    } catch (e) {
        console.error("❌ ERROR:", e.message);
    }
}
test();
