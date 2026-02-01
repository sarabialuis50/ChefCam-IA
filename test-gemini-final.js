import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function testGemini() {
    try {
        const envContent = fs.readFileSync(".env", "utf8");
        const match = envContent.match(/VITE_GEMINI_API_KEY=([^\r\n]*)/);

        if (!match) {
            console.error("No se encontró VITE_GEMINI_API_KEY en el .env");
            process.exit(1);
        }

        // Limpiamos la clave de CUALQUIER espacio o salto de línea oculto
        const apiKey = match[1].replace(/\s/g, "");
        console.log(`Probando clave (limpia): ${apiKey.substring(0, 10)}...`);

        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Usamos 1.5 para asegurar cuota

        console.log("Iniciando prueba de servidor...");
        const result = await model.generateContent("Hola");
        const response = await result.response;
        console.log("--- RESULTADO EXITOSO ---");
        console.log(response.text());
        console.log("--------------------------");
        process.exit(0);
    } catch (error) {
        console.error("--- ERROR ---");
        console.error(error.message);
        process.exit(1);
    }
}

testGemini();
