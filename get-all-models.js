async function main() {
    const apiKey = "AIzaSyACgBZWH3KWlHuQRKTxwi59n8eUJlzmOg4";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    const names = data.models.map(m => m.name);
    console.log("Found", names.length, "models");
    console.log(JSON.stringify(names));
}
main();
