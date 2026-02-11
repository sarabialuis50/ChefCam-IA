const ENV_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";
const FALLBACK_KEY = "NcAFAIe1Vdf4ufPGwuxFmjbCjWpf4yeCRrd4goHlM8rBaPD9c4S3UZEL";

// Cache para evitar repetir imágenes en la misma sesión
const usedImagesCache = new Set<string>();
let fallbackCounter = 0;

/**
 * Obtiene una imagen única para una receta.
 * Busca múltiples resultados y selecciona uno no usado.
 */
export const getRecipeImage = async (query: string): Promise<string> => {
    const effectiveKey = ENV_KEY || FALLBACK_KEY;
    const cleanQuery = (query || "delicious food").trim();
    const timestamp = Date.now();

    console.log(`🔍 [Pexels] Buscando: "${cleanQuery}" (Key: ${effectiveKey.substring(0, 5)}...)`);

    try {
        const fetchImages = async (q: string): Promise<string[]> => {
            const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=20`;
            const response = await fetch(url, {
                headers: {
                    "Authorization": effectiveKey
                }
            });

            if (!response.ok) {
                console.warn(`❌ Pexels API error: ${response.status} (${response.statusText}) para: ${q}`);
                return [];
            }

            const data = await response.json();
            const photos = (data.photos || [])
                .map((photo: any) => photo?.src?.large || photo?.src?.original)
                .filter(Boolean);

            console.log(`✅ Pexels encontró ${photos.length} imágenes para "${q}"`);
            return photos;
        };

        // Búsqueda primaria
        let images = await fetchImages(cleanQuery);

        // Si no hay resultados, intentar con algo genérico pero relacionado
        if (images.length === 0) {
            console.log(`⚠️ No hay resultados para "${cleanQuery}", intentando búsqueda simplificada...`);
            const firstWord = cleanQuery.split(' ')[0];
            images = await fetchImages(`${firstWord} food`);
        }

        // Filtrar imágenes ya usadas para esta sesión
        let availableImages = images.filter(url => !usedImagesCache.has(url));

        // Si no quedan nuevas, reusar de las obtenidas pero aleatoriamente
        if (availableImages.length === 0 && images.length > 0) {
            console.log("♻️ Reusando imágenes del cache para mayor variedad");
            availableImages = images;
        }

        if (availableImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableImages.length);
            const selectedImage = availableImages[randomIndex];
            usedImagesCache.add(selectedImage);
            return selectedImage;
        }

        // Fallback dinámico si Pexels falla totalmente o no hay resultados
        fallbackCounter++;
        const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(cleanQuery.split(' ')[0])}-${timestamp}-${fallbackCounter}/800/600`;
        console.warn(`🚩 Fallback a Picsum: ${fallbackUrl}`);
        return fallbackUrl;

    } catch (error) {
        console.error("❌ Error fatal en pexelsService:", error);
        fallbackCounter++;
        return `https://picsum.photos/seed/food-${timestamp}-${fallbackCounter}/800/600`;
    }
};

/**
 * Limpia el cache de imágenes usadas.
 */
export const clearImageCache = () => {
    usedImagesCache.clear();
    fallbackCounter = 0;
    console.log("🗑️ Cache de imágenes reiniciado");
};

