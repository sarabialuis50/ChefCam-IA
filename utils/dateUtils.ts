export const getDaysDiff = (dateStr: string): number => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Parse 'YYYY-MM-DD' as local date to avoid timezone shifts
    const [year, month, day] = dateStr.split('-').map(Number);
    const expiryDate = new Date(year, month - 1, day);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};
export const formatLocalDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
};
