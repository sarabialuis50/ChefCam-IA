const key = "NcAFAIe1Vdf4ufPGwuxFmjbCjWpf4yeCRrd4goHlM8rBaPD9c4S3UZEL";
const query = "delicious food";

async function testPexels() {
    console.log("Probando nueva clave Pexels...");
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: {
                Authorization: key
            }
        });
        const data = await response.json();
        if (response.ok) {
            console.log("✅ ¡ÉXITO! Clave de Pexels válida.");
            console.log("Imagen obtenida:", data.photos?.[0]?.src?.original);
        } else {
            console.log("❌ Error Pexels:", response.status, data.error || JSON.stringify(data));
        }
    } catch (e) {
        console.log("❌ Error fatal:", e.message);
    }
}

testPexels();
