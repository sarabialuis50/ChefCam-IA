const key = "AQ.Ab8RN6Lam4TUamRoSEe9GoHQJ6ksCajtrRcpRlwVw30ij0ZA1g";

async function test() {
    console.log(`Testing key: ${key.substring(0, 10)}...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
        });
        const data = await response.json();
        console.log(`Result:`, response.status, JSON.stringify(data));
    } catch (e) {
        console.log(`Error:`, e.message);
    }
}
test();
