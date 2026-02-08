const ENV_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";
const FALLBACK_KEY = "NcAFAIe1Vdf4ufPGwuxFmjbCjWpf4yeCRrd4goHlM8rBaPD9c4S3UZEL";

// Cache para evitar repetir imágenes en la misma sesión
const usedImagesCache = new Set<string>();
// Contador para fallback único cuando Pexels falla
let fallbackCounter = 0;

/**
 * Obtiene una imagen única para una receta.
 * Busca múltiples resultados y selecciona aleatoriamente uno no usado.
 */
export const getRecipeImage = async (query: string): Promise<string> => {
    const effectiveKey = ENV_KEY || FALLBACK_KEY;
    const cleanQuery = (query || "delicious food").trim();
    const timestamp = Date.now(); // Para cache-busting

    try {
        const fetchImages = async (q: string): Promise<string[]> => {
            // Obtener 15 imágenes para tener variedad
            const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=15&orientation=landscape`;
            const response = await fetch(url, {
                headers: {
                    "Authorization": effectiveKey,
                    "Cache-Control": "no-cache"
                }
            });
            if (!response.ok) {
                console.warn(`Pexels API error: ${response.status} for query: ${q}`);
                return [];
            }
            const data = await response.json();
            // Extraer todas las URLs de imágenes
            return (data.photos || []).map((photo: any) => photo?.src?.large).filter(Boolean);
        };

        // Búsqueda primaria
        let images = await fetchImages(cleanQuery);

        // Si no hay suficientes resultados, intentar con variaciones
        if (images.length < 3) {
            const foodQuery = `${cleanQuery} food`;
            const moreImages = await fetchImages(foodQuery);
            images = [...images, ...moreImages];
        }

        // Si aún no hay resultados, probar con la primera palabra
        if (images.length === 0) {
            const firstWord = cleanQuery.split(' ')[0];
            images = await fetchImages(`${firstWord} dish`);
        }

        // Filtrar imágenes ya usadas en esta sesión
        const availableImages = images.filter(url => !usedImagesCache.has(url));

        // Si todas están usadas, limpiar el cache parcialmente (mantener últimas 10)
        if (availableImages.length === 0 && images.length > 0) {
            const cacheArray = Array.from(usedImagesCache);
            if (cacheArray.length > 10) {
                cacheArray.slice(0, cacheArray.length - 10).forEach(url => usedImagesCache.delete(url));
            }
            // Usar una imagen random de las disponibles
            const randomIndex = Math.floor(Math.random() * images.length);
            const selectedImage = images[randomIndex];
            usedImagesCache.add(selectedImage);
            console.log(`📸 Imagen seleccionada (cache reset): ${selectedImage.substring(0, 50)}...`);
            return selectedImage;
        }

        // Seleccionar aleatoriamente de las disponibles
        if (availableImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableImages.length);
            const selectedImage = availableImages[randomIndex];
            usedImagesCache.add(selectedImage);
            console.log(`📸 Imagen única seleccionada para "${cleanQuery}": ${selectedImage.substring(0, 50)}...`);
            return selectedImage;
        }

        // Si todo falla en Pexels, usar fallback dinámico y ÚNICO
        console.warn("Pexels no encontró resultados para:", cleanQuery, "usando fallback dinámico único");
        fallbackCounter++;

        // Usar timestamp + contador + query para garantizar unicidad
        const uniqueSeed = `${cleanQuery}-${timestamp}-${fallbackCounter}`;
        return `https://picsum.photos/seed/${encodeURIComponent(uniqueSeed)}/800/600`;

    } catch (error) {
        console.error("Error en servicio de imágenes:", error);
        // Fallback final único usando timestamp
        fallbackCounter++;
        const uniqueFallback = `https://picsum.photos/seed/food-${timestamp}-${fallbackCounter}/800/600`;
        return uniqueFallback;
    }
};

// Función para limpiar el cache (útil al inicio de nueva generación)
export const clearImageCache = () => {
    usedImagesCache.clear();
    fallbackCounter = 0;
    console.log("🗑️ Cache de imágenes limpiado");
};
