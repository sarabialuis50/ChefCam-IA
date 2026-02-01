async function main() {
    const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    const names = data.models.map(m => m.name);
    console.log("Has 1.5-flash?", names.includes("models/gemini-1.5-flash"));
    console.log("Has 1.5-pro?", names.includes("models/gemini-1.5-pro"));
    console.log("Has 2.0-flash?", names.includes("models/gemini-2.0-flash"));
    console.log("Has 2.5-flash?", names.includes("models/gemini-2.5-flash"));
}
main();
