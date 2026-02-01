const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (response.ok) {
            // Print in chunks to avoid truncation
            const names = data.models.map(m => m.name);
            console.log("TOTAL MODELS:", names.length);
            for (let i = 0; i < names.length; i += 10) {
                console.log(names.slice(i, i + 10).join("\n"));
            }
        }
    } catch (e) { }
}

listModels();
