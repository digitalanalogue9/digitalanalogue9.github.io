import { CookieConsent } from '@/lib/types/Consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Queue for storing gtag calls before gtag is loaded
const gtagQueue: Array<[string, ...unknown[]]> = [];

export const isGtagDefined = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Process any queued gtag calls
const processQueue = () => {
  if (!isGtagDefined()) return;

  while (gtagQueue.length > 0) {
    const args = gtagQueue.shift();
    if (args) {
      window.gtag!(...args);
    }
  }
};

export const safeGtag = (command: string, ...args: unknown[]) => {
  if (isGtagDefined()) {
    window.gtag!(command, ...args);
  } else {
    // Queue the call for later
    gtagQueue.push([command, ...args]);
  }
};

// Function to initialize gtag
export const initializeGtag = (GA_MEASUREMENT_ID: string, cookieConsent: CookieConsent) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  console.log('gtag function defined:', typeof window.gtag === 'function');

  window.gtag('js', new Date());

  // Set default consent to denied
  window.gtag('consent', 'default', {
    analytics_storage: cookieConsent.analytics === 'granted' ? 'granted' : 'denied',
    'personalization_storage ': cookieConsent.analytics === 'granted' ? 'granted' : 'denied',
    ad_storage: cookieConsent.advertisement === 'granted' ? 'granted' : 'denied',
    ad_user_data: cookieConsent.advertisement === 'granted' ? 'granted' : 'denied',
    ad_personalization: cookieConsent.advertisement === 'granted' ? 'granted' : 'denied',
    functionality_storage: cookieConsent.functional === 'granted' ? 'granted' : 'denied',
    security_storage: 'granted',
  });

  // Initialize the GA configuration
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    transport_type: 'beacon',
    send_page_view: true,
  });

  // Process any queued calls
  processQueue();
};

export const updateConsent = (cookieConsent: CookieConsent) => {
  safeGtag('consent', 'update', {
    analytics_storage: cookieConsent.analytics === 'granted' ? 'granted' : 'denied',
    'personalization_storage ': cookieConsent.analytics === 'granted' ? 'granted' : 'denied',
    ad_storage: cookieConsent.advertisement === 'granted' ? 'granted' : 'denied',
    ad_user_data: cookieConsent.advertisement === 'granted' ? 'granted' : 'denied',
    ad_personalization: cookieConsent.advertisement === 'granted' ? 'granted' : 'denied',
    functionality_storage: cookieConsent.functional === 'granted' ? 'granted' : 'denied',
    security_storage: 'granted',
  });
};
