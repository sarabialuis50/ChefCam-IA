const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
const model = "gemini-2.5-flash";

async function test() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
        });
        const data = await response.json();
        console.log(`Result for ${model}:`, response.status, JSON.stringify(data));
    } catch (e) {
        console.log(`Error for ${model}:`, e.message);
    }
}
test();
