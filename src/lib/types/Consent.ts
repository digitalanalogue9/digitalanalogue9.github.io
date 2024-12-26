export type ConsentStatus = 'granted' | 'denied' | 'pending';

export interface CookieConsent {
  analytics: ConsentStatus;
  functional: ConsentStatus;
  advertisement: ConsentStatus;
  timestamp: number;
}

export type ConsentType = keyof Omit<CookieConsent, 'timestamp'>;
