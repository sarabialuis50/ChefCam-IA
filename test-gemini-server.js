import { GoogleGenAI } from "@google/genai";

async function testGemini() {
    const apiKey = "AIzaSyC7GqL8xm7Ax3k_P84ubHNJwo-eZar4zl4";
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        console.log("Iniciando prueba de servidor con Gemini 2.0 Flash...");
        const result = await model.generateContent("Di 'Conexión Exitosa desde el servidor' en español.");
        const response = await result.response;
        const text = response.text();
        console.log("--- RESULTADO ---");
        console.log(text);
        console.log("-----------------");
        process.exit(0);
    } catch (error) {
        console.error("--- ERROR DE CONEXIÓN ---");
        console.error(error.message || error);
        if (error.status) console.error("Código Status:", error.status);
        process.exit(1);
    }
}

testGemini();
