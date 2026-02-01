const key = "NcAFAIe1Vdf4ufPGwuxFmjbCjWpf4yeCRrd4goHlM8rBaP";
const query = "banana curry food dish";

async function testPexels() {
    console.log("Testing Pexels API...");
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: {
                Authorization: key
            }
        });
        const data = await response.json();
        if (response.ok) {
            console.log("✅ Pexels Success!");
            console.log("Image URL:", data.photos?.[0]?.src?.large);
        } else {
            console.log("❌ Pexels Failed:", response.status, data.error || JSON.stringify(data));
        }
    } catch (e) {
        console.log("❌ Error:", e.message);
    }
}

testPexels();
