import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
    const genAI = new GoogleGenerativeAI("AIzaSyC7GqL8xm7Ax3k_P84ubHNJwo-eZar4zl4");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hola");
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
test();
