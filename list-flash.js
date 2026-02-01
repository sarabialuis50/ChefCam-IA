async function main() {
    const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    const flashModels = data.models.filter(m => m.name.includes("flash")).map(m => m.name);
    console.log("FLASH MODELS:", flashModels.join("\n"));
}
main();
