import { useCallback, useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils/localStorage';
import type { ConsentStatus, CookieConsent } from '@/lib/types/Consent';

const CONSENT_KEY = 'cookie-consent';
const CONSENT_CHANGED_EVENT = 'core-values-consent-changed';
const DEFAULT_CONSENT: CookieConsent = {
  analytics: 'pending',
  functional: 'pending',
  advertisement: 'denied',
  timestamp: 0,
};

function isConsentStatus(value: unknown): value is ConsentStatus {
  return value === 'granted' || value === 'denied' || value === 'pending';
}

function normalizeConsent(value: unknown): CookieConsent {
  if (!value || typeof value !== 'object') return DEFAULT_CONSENT;

  const candidate = value as Partial<CookieConsent>;
  return {
    analytics: isConsentStatus(candidate.analytics) ? candidate.analytics : DEFAULT_CONSENT.analytics,
    functional: isConsentStatus(candidate.functional) ? candidate.functional : DEFAULT_CONSENT.functional,
    advertisement: isConsentStatus(candidate.advertisement) ? candidate.advertisement : DEFAULT_CONSENT.advertisement,
    timestamp: typeof candidate.timestamp === 'number' ? candidate.timestamp : DEFAULT_CONSENT.timestamp,
  };
}

function readStoredConsent(): CookieConsent {
  try {
    return normalizeConsent(getLocalStorage(CONSENT_KEY, DEFAULT_CONSENT));
  } catch {
    return DEFAULT_CONSENT;
  }
}

function saveConsent(consent: CookieConsent) {
  try {
    setLocalStorage(CONSENT_KEY, consent);
  } catch {
    // Consent remains active for the current visit if browser storage is unavailable.
  }
}

function broadcastConsent(consent: CookieConsent) {
  window.dispatchEvent(new CustomEvent<CookieConsent>(CONSENT_CHANGED_EVENT, { detail: consent }));
}

export function useConsent() {
  const [consent, setConsent] = useState<CookieConsent>(readStoredConsent);
  const isInitialized = true;

  useEffect(() => {
    const handleConsentChanged = (event: Event) => {
      setConsent(normalizeConsent((event as CustomEvent<CookieConsent>).detail));
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY) return;
      try {
        setConsent(event.newValue ? normalizeConsent(JSON.parse(event.newValue)) : DEFAULT_CONSENT);
      } catch {
        setConsent(DEFAULT_CONSENT);
      }
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChanged);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateConsent = useCallback(
    (newConsent: Partial<CookieConsent>) => {
      const nextConsent = normalizeConsent({ ...consent, ...newConsent, timestamp: Date.now() });
      setConsent(nextConsent);
      saveConsent(nextConsent);
      broadcastConsent(nextConsent);
    },
    [consent]
  );

  return {
    consent,
    updateConsent,
    isInitialized,
  };
}
