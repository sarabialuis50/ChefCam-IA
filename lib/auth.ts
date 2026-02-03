
export const getRedirectUrl = () => {
    const isProd = import.meta.env.PROD || window.location.hostname === 'chefscania.com';
    if (isProd) {
        return 'https://chefscania.com/auth/callback';
    }
    // Use VITE_SITE_URL or fallback to localhost:3000
    const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
    return `${siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl}/auth/callback`;
};
