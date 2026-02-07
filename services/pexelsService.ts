const ENV_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";
const FALLBACK_KEY = "NcAFAIe1Vdf4ufPGwuxFmjbCjWpf4yeCRrd4goHlM8rBaPD9c4S3UZEL";

export const getRecipeImage = async (query: string): Promise<string> => {
    const effectiveKey = ENV_KEY || FALLBACK_KEY;
    const cleanQuery = (query || "delicious food").trim();

    try {
        const fetchImage = async (q: string) => {
            const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`;
            const response = await fetch(url, {
                headers: {
                    "Authorization": effectiveKey
                }
            });
            if (!response.ok) {
                console.warn(`Pexels API error: ${response.status} for query: ${q}`);
                return null;
            }
            const data = await response.json();
            return data.photos?.[0]?.src?.large || null;
        };

        // Búsqueda primaria
        let imageUrl = await fetchImage(cleanQuery);

        // Si falla, intentar con algo más genérico basado en la primera palabra
        if (!imageUrl) {
            const firstWord = cleanQuery.split(' ')[0];
            imageUrl = await fetchImage(`${firstWord} dish`);
        }

        if (imageUrl) return imageUrl;

        // Si todo falla en Pexels, usamos un fallback dinámico y consistente
        console.warn("Pexels no encontró resultados para:", cleanQuery, "usando fallback dinámico");

        // Usamos una semilla basada en la consulta para que sea "consistente" pero diferente para cada plato
        // Picsum es rápido y confiable para placeholders variados
        return `https://picsum.photos/seed/${encodeURIComponent(cleanQuery)}/800/600`;

    } catch (error) {
        console.error("Error en servicio de imágenes:", error);
        // Fallback final ultrarobusto
        return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000`;
    }
};
