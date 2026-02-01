const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
const candidates = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp"
];

async function findWorkingModel() {
    for (const model of candidates) {
        console.log(`Checking ${model}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`✅ SUCCESS with ${model}`);
                process.exit(0);
            } else {
                console.log(`❌ FAILED ${model}: ${response.status} - ${data.error?.message || JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log(`❌ ERROR ${model}: ${e.message}`);
        }
    }
}

findWorkingModel();
