const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-flash"];

async function checkQuota() {
    for (const model of models) {
        console.log(`Checking ${model}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
            const r = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
            });
            const data = await r.json();
            if (r.ok) {
                console.log(`✅ ${model} works!`);
            } else {
                console.log(`❌ ${model} error: ${r.status} - ${data.error?.message || JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log(`❌ ${model} exception: ${e.message}`);
        }
    }
}
checkQuota();
