import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsent } from '@/lib/hooks/useConsent';
import type { ConsentStatus } from '@/lib/types/Consent';

export default function CookieBanner() {
  const { consent, updateConsent, isInitialized } = useConsent();
  const [choices, setChoices] = useState(consent);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setChoices(consent), [consent]);
  useEffect(() => {
    if (isInitialized && consent.analytics === 'pending') setIsVisible(true);
  }, [consent.analytics, isInitialized]);

  const chooseConsent = (analytics: ConsentStatus, functional: ConsentStatus) => {
    updateConsent({ analytics, functional, advertisement: 'denied' });
    setIsVisible(false);
  };

  const updateChoice = (type: 'analytics' | 'functional', granted: boolean) => {
    setChoices((current) => ({ ...current, [type]: granted ? 'granted' : 'denied' }));
  };

  if (!isVisible) return null;

  return (
    <section
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="border-b border-slate-200 bg-white px-4 py-5 text-slate-900 shadow-sm sm:px-6 print:hidden"
    >
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl space-y-2">
            <h2 id="cookie-consent-title" className="text-lg font-semibold sm:text-xl">
              Privacy preferences
            </h2>
            <p id="cookie-consent-description" className="text-sm leading-relaxed sm:text-base">
              Optional Google Analytics helps us understand visits to this site. It stays off until you allow it. Your
              sessions remain on this device either way.{' '}
              <Link to="/privacy" className="font-semibold underline underline-offset-2 focus-visible:outline-2">
                Read the Privacy Policy
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => chooseConsent('granted', 'granted')}
              className="min-h-11 rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Allow Analytics
            </button>
            <button
              type="button"
              onClick={() => chooseConsent('denied', 'denied')}
              className="min-h-11 rounded-md border border-slate-500 px-5 py-2 font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Reject optional cookies
            </button>
          </div>
        </div>

        <details className="border-t border-slate-200 pt-3">
          <summary className="w-fit cursor-pointer rounded-sm font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">
            Customize preferences
          </summary>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label htmlFor="consent-analytics" className="flex min-h-11 items-center gap-3">
                <input
                  id="consent-analytics"
                  type="checkbox"
                  checked={choices.analytics === 'granted'}
                  onChange={(event) => updateChoice('analytics', event.target.checked)}
                  className="size-5 accent-blue-700"
                />
                <span>Google Analytics</span>
              </label>
              <label htmlFor="consent-functional" className="flex min-h-11 items-center gap-3">
                <input
                  id="consent-functional"
                  type="checkbox"
                  checked={choices.functional === 'granted'}
                  onChange={(event) => updateChoice('functional', event.target.checked)}
                  className="size-5 accent-blue-700"
                />
                <span>Functional preferences</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => chooseConsent(choices.analytics, choices.functional)}
              className="min-h-11 w-full rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
            >
              Save preferences
            </button>
          </div>
        </details>
      </div>
    </section>
  );
}
