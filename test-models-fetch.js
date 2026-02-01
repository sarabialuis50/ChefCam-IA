const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
const models = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-pro"];

async function testModels() {
    for (const model of models) {
        console.log(`Testing model: ${model}...`);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello" }] }]
                })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`✅ ${model} works!`);
            } else {
                console.log(`❌ ${model} failed: ${response.status} - ${data.error?.message || JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log(`❌ ${model} fetch failed: ${e.message}`);
        }
    }
}

testModels();
