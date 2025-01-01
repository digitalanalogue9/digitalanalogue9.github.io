import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils/localStorage';
import { CookieConsent, ConsentStatus } from '@/lib/types/Consent';
import { updateConsent as updateGtagConsent } from '@/lib/utils/gtagHelper/gtagWrapper';

const CONSENT_KEY = 'cookie-consent';
const DEFAULT_CONSENT: CookieConsent = {
  analytics: 'pending',
  functional: 'pending',
  advertisement: 'denied',
  timestamp: 0,
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
    updateGtagConsent(consent);

    // Store consent with timestamp
    setLocalStorage(CONSENT_KEY, {
      ...consent,
      timestamp: Date.now(),
    });
  }, [consent, isInitialized]);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    setConsent((prev) => ({
      ...prev,
      ...newConsent,
      timestamp: Date.now(),
    }));
  };

  return {
    consent,
    updateConsent,
    isInitialized,
  };
}
