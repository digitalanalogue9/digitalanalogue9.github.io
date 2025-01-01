import { safeGtag } from './gtagWrapper';

export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  safeGtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const updateConsent = (analytics_storage: 'granted' | 'denied') => {
  safeGtag('consent', 'update', {
    analytics_storage,
  });
};
