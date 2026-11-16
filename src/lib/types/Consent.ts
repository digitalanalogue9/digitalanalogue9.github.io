export type ConsentStatus = 'granted' | 'denied' | 'pending';

export interface CookieConsent {
  analytics: ConsentStatus;
  advertisement: ConsentStatus;
  timestamp: number;
}
