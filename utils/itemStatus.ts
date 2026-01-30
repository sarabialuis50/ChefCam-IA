import { getDaysDiff } from './dateUtils';

export interface ItemStatus {
    statusKey: string;
    borderColorStyle: string; // Used for style={{ borderColor: ... }} or class
    textColorClass: string;
    effectClasses: string;
    shadowClass?: string;
}

// Colors based on user request
// Vencido: Morado
// Vence hoy: Rojo
// Vence mañana: Naranja
// Dos días en adelante: Verde

const COLORS = {
    purple: '#9333ea',
    red: '#ef4444',
    orange: '#f97316',
    green: '#22c55e',
};

export const getItemStatus = (expiryDate?: string): ItemStatus | null => {
    if (!expiryDate) return null;

    const daysLeft = getDaysDiff(expiryDate);

    if (daysLeft < 0) {
        // Vencido
        return {
            statusKey: 'expired',
            borderColorStyle: COLORS.purple,
            textColorClass: 'text-purple-600',
            // Latido un poco más fuerte (Pulse + Shadow)
            effectClasses: 'animate-pulse',
            shadowClass: 'shadow-[0_0_20px_rgba(147,51,234,0.5),inset_0_0_10px_rgba(147,51,234,0.2)]'
        };
    } else if (daysLeft === 0) {
        // Vence hoy
        return {
            statusKey: 'expires_today',
            borderColorStyle: COLORS.red,
            textColorClass: 'text-red-500',
            // Latido moderado (Pulse standard)
            effectClasses: 'animate-pulse',
            shadowClass: ''
        };
    } else if (daysLeft === 1) {
        // Un día para vencer (Vence mañana)
        return {
            statusKey: 'expires_tomorrow',
            borderColorStyle: COLORS.orange,
            textColorClass: 'text-orange-500',
            // Sin efecto
            effectClasses: '',
            shadowClass: ''
        };
    } else {
        // Dos días en adelante (Proximo a vencer)
        // Note: For standard inventory, this might need conditional application if we don't want ALL items to look like this.
        // But the prompt implies "Dos días para vencer en adelante" gets this style.
        return {
            statusKey: 'prox_expiry',
            borderColorStyle: COLORS.green,
            textColorClass: 'text-green-500',
            // Sin efecto
            effectClasses: '',
            shadowClass: ''
        };
    }
};
