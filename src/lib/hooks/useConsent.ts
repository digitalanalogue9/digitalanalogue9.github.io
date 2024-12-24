import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils/localStorage';
import { CookieConsent, ConsentStatus } from '@/lib/types/Consent';
import { updateConsent as updateGtagConsent } from '@/lib/utils/gtagHelper';

const CONSENT_KEY = 'cookie-consent';
const DEFAULT_CONSENT: CookieConsent = {
  analytics: 'pending',
  functional: 'pending',
  timestamp: 0
};

export function useConsent() {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedConsent = getLocalStorage(CONSENT_KEY, DEFAULT_CONSENT);
    setConsent(storedConsent);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Update Google Analytics consent
    // Convert 'pending' to 'denied' for GA as it only accepts 'granted' or 'denied'
    const analyticsStatus = consent.analytics === 'pending' ? 'denied' : consent.analytics;
    
    // Use the safe wrapper for updating consent
    updateGtagConsent(analyticsStatus);

    // Store consent with timestamp
    setLocalStorage(CONSENT_KEY, {
      ...consent,
      timestamp: Date.now()
    });
  }, [consent, isInitialized]);

  const updateConsent = (status: ConsentStatus) => {
    setConsent(prev => ({
      ...prev,
      analytics: status,
      functional: status,
      timestamp: Date.now()
    }));
  };

  return {
    consent,
    updateConsent,
    isInitialized
  };
}
