export const environment = {
  production: true,
  apiBaseUrl: 'https://api.prodirectory.com/api',
  analytics: {
    enabled: true,
    provider: 'ga4' as const,
    measurementId: 'G-XXXXXXXXXX', // Replace with your production GA4 ID
    debug: false,
  },
};
