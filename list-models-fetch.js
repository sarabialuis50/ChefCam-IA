const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";

async function listModels() {
    console.log("Listing models for key...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (response.ok) {
            console.log("Available models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log(`Failed to list models: ${response.status} - ${JSON.stringify(data)}`);
        }
    } catch (e) {
        console.log(`Fetch failed: ${e.message}`);
    }
}

listModels();
