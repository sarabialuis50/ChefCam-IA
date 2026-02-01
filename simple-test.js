import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.VITE_GEMINI_API_KEY;
console.log("KEY FROM ENV:", key ? "FOUND" : "NOT FOUND");
if (key) {
    const genAI = new GoogleGenAI(key.trim());
    console.log("SUCCESSFULLY INITIALIZED GoogleGenAI");
}
