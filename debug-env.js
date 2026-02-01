import fs from "fs";

const envContent = fs.readFileSync(".env", "utf8");
console.log("Contenido crudo del .env (primeros 200 caracteres):");
console.log(JSON.stringify(envContent.substring(0, 200)));

const match = envContent.match(/VITE_GEMINI_API_KEY=([\s\S]*?)(?=VITE_SUPABASE|VITE_PUBLIC|$)/);
if (match) {
    const rawKey = match[1];
    const cleanKey = rawKey.replace(/[\r\n\s]/g, "");
    console.log("Clave extraída y limpia:", cleanKey);
    console.log("Longitud de la clave:", cleanKey.length);
} else {
    console.log("No se pudo extraer la clave con regex.");
}
