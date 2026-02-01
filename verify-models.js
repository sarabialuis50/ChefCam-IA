const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (response.ok) {
            const gemini15 = data.models.filter(m => m.name.includes("1.5")).map(m => m.name);
            console.log("GEMINI 1.5 MODELS:", gemini15.join(", "));

            const gemini20 = data.models.filter(m => m.name.includes("2.0")).map(m => m.name);
            console.log("GEMINI 2.0 MODELS:", gemini20.join(", "));

            const all = data.models.map(m => m.name);
            console.log("ALL MODELS:", all.join(", "));
        }
    } catch (e) { }
}

listModels();
