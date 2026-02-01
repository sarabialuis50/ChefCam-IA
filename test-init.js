import { GoogleGenAI } from "@google/genai";

const key = "AIzaSyC7GqL8xm7Ax3k_P84ubHNJwo-eZar4zl4";
console.log("TESTING WITH OBJECT { apiKey: key }");
try {
    const genAI = new GoogleGenAI({ apiKey: key });
    console.log("SUCCESSFULLY INITIALIZED WITH OBJECT");
} catch (e) {
    console.log("FAILED WITH OBJECT:", e.message);
}
