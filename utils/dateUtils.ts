export const getDaysDiff = (dateStr: string): number => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const expiry = new Date(dateStr);
    const expiryDate = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};
