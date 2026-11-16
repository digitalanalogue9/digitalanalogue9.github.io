import { Link } from 'react-router-dom';
import { useConsent } from '@/lib/hooks/useConsent';
import type { ConsentStatus } from '@/lib/types/Consent';

export default function CookieBanner() {
  const { consent, updateConsent } = useConsent();
  const chooseConsent = (analytics: ConsentStatus) => {
    updateConsent({ analytics, advertisement: 'denied' });
  };

  if (consent.analytics !== 'pending') return null;

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
              onClick={() => chooseConsent('granted')}
              className="rounded-sys-radius-button-sm bg-ref-color-brand-accent text-interface-base-small text-sys-color-text-primary min-h-11 px-5 py-2 font-semibold transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
            >
              Allow analytics
            </button>
            <button
              type="button"
              onClick={() => chooseConsent('denied')}
              className="rounded-sys-radius-button-sm bg-ref-color-brand-accent text-interface-base-small text-sys-color-text-primary min-h-11 px-5 py-2 font-semibold transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
            >
              Reject analytics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
