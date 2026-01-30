export const formatPrepTime = (prepTime: string | null | undefined): string => {
    if (!prepTime) return '25 MIN';

    // Limitar a la parte principal del tiempo (antes del + o de paréntesis)
    let formatted = prepTime.split('+')[0].split('(')[0];

    // Limpiar espacios en blanco
    formatted = formatted.trim();

    // Asegurarse de que no sea excesivamente largo por si acaso
    if (formatted.length > 20) {
        // Si sigue siendo muy largo (e.g. "45 MINUTOS DE PREPARACION"), intentar extraer solo número y unidad
        const match = formatted.match(/\d+\s*(MINUTOS|MINS|MIN|HORAS|H|HORS)/i);
        if (match) return match[0].toUpperCase();
    }

    return formatted.toUpperCase();
};
