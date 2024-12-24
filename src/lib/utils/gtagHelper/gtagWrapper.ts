declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
      dataLayer?: any[];
    }
  }
  
  // Queue for storing gtag calls before gtag is loaded
  let gtagQueue: Array<[string, ...any[]]> = [];
  
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
  
  export const safeGtag = (command: string, ...args: any[]) => {
    if (isGtagDefined()) {
      window.gtag!(command, ...args);
    } else {
      // Queue the call for later
      gtagQueue.push([command, ...args]);
    }
  };
  
  // Function to initialize gtag
  export const initializeGtag = (GA_MEASUREMENT_ID: string) => {
    if (typeof window === 'undefined') return;
  
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
    
    window.gtag('js', new Date());
    
    // Set default consent to denied
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied'
    });
  
    // Initialize the GA configuration
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      transport_type: 'beacon',
      send_page_view: true
    });
  
    // Process any queued calls
    processQueue();
  };
  