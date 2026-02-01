import fs from 'fs';

async function main() {
    const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            console.log("--- MODELS LIST ---");
            data.models.forEach(m => console.log(m.name));
            console.log("--- END ---");
        } else {
            console.log("NO MODELS:", JSON.stringify(data));
        }
    } catch (e) {
        console.log("ERROR:", e.message);
    }
}
main();
