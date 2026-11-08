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
      className="bg-ref-color-brand-primary border-t border-white/30 px-4 py-5 text-white shadow-sm sm:px-6 print:hidden"
    >
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl space-y-2">
            <h2 id="cookie-consent-title" className="text-interface-title-3 font-semibold text-white">
              Privacy preferences
            </h2>
            <p
              id="cookie-consent-description"
              className="text-interface-base-small sm:text-interface-base-default text-white"
            >
              Optional Google Analytics helps me understand visits to this site. It stays off until you allow it. Your
              exercises are saved in this browser either way.{' '}
              <Link
                to="/privacy"
                className="font-semibold text-white underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
              >
                Read the privacy notice
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => chooseConsent('granted', 'granted')}
              className="rounded-sys-radius-button-sm bg-ref-color-brand-accent text-interface-base-small text-sys-color-text-primary min-h-11 px-5 py-2 font-semibold transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Allow analytics
            </button>
            <button
              type="button"
              onClick={() => chooseConsent('denied', 'denied')}
              className="rounded-sys-radius-button-sm text-interface-base-small min-h-11 border border-white px-5 py-2 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Reject optional cookies
            </button>
          </div>
        </div>

        <details className="border-t border-white/30 pt-3">
          <summary className="w-fit cursor-pointer rounded-sm font-semibold text-white underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Customise preferences
          </summary>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label htmlFor="consent-analytics" className="flex min-h-11 items-center gap-3">
                <input
                  id="consent-analytics"
                  type="checkbox"
                  checked={choices.analytics === 'granted'}
                  onChange={(event) => updateChoice('analytics', event.target.checked)}
                  className="apc-checkbox__control"
                />
                <span>Google Analytics</span>
              </label>
              <label htmlFor="consent-functional" className="flex min-h-11 items-center gap-3">
                <input
                  id="consent-functional"
                  type="checkbox"
                  checked={choices.functional === 'granted'}
                  onChange={(event) => updateChoice('functional', event.target.checked)}
                  className="apc-checkbox__control"
                />
                <span>Functional preferences</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => chooseConsent(choices.analytics, choices.functional)}
              className="rounded-sys-radius-button-sm bg-ref-color-brand-accent text-interface-base-small text-sys-color-text-primary min-h-11 w-full px-5 py-2 font-semibold transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Save preferences
            </button>
          </div>
        </details>
      </div>
    </section>
  );
}
