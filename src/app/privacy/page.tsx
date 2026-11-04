import { useEffect, useState } from 'react';
import { useConsent } from '@/lib/hooks/useConsent';

export default function PrivacyPage() {
  const { consent, updateConsent, isInitialized } = useConsent();
  const [analyticsChoice, setAnalyticsChoice] = useState(consent.analytics === 'granted');
  const [saved, setSaved] = useState(false);

  useEffect(() => setAnalyticsChoice(consent.analytics === 'granted'), [consent.analytics]);

  const saveAnalyticsChoice = (granted: boolean) => {
    setAnalyticsChoice(granted);
    updateConsent({ analytics: granted ? 'granted' : 'denied', advertisement: 'denied' });
    setSaved(true);
  };

  return (
    <article className="mx-auto max-w-4xl space-y-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <header className="block bg-transparent p-0 text-slate-900 shadow-none">
        <h1 className="mt-0 text-3xl font-bold sm:text-4xl">Privacy</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          This notice explains how the personal Core Values app stores information and uses optional analytics.
        </p>
      </header>

      <section aria-labelledby="local-data-heading" className="space-y-2">
        <h2 id="local-data-heading" className="text-xl font-semibold">
          Your sessions and preferences
        </h2>
        <p className="leading-relaxed text-slate-700">
          Exercise sessions are stored in this browser on your device. Your consent choice is saved in browser local
          storage. The app does not send session content to a server. Clearing this browser&apos;s site data can remove
          saved sessions and preferences; you can export sessions from the app to keep a copy.
        </p>
      </section>

      <section aria-labelledby="analytics-heading" className="space-y-2">
        <h2 id="analytics-heading" className="text-xl font-semibold">
          Google Analytics
        </h2>
        <p className="leading-relaxed text-slate-700">
          If you allow Analytics, this site uses Google Analytics property G-JZPX5JCP5D to measure page visits. The
          Google Analytics script is not requested and page views are not sent unless you grant consent. Advertising and
          Google Signals are disabled. Rejecting or withdrawing consent stops further page views for this visit.
        </p>
      </section>

      <section aria-labelledby="manage-consent-heading" className="space-y-3">
        <h2 id="manage-consent-heading" className="text-xl font-semibold">
          Manage Analytics consent
        </h2>
        <p className="leading-relaxed text-slate-700">
          Your current choice is{' '}
          <strong>{!isInitialized || consent.analytics === 'pending' ? 'not set' : consent.analytics}</strong>. You can
          change it at any time.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveAnalyticsChoice(true)}
            aria-pressed={analyticsChoice}
            className="min-h-11 rounded-md bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Allow Analytics
          </button>
          <button
            type="button"
            onClick={() => saveAnalyticsChoice(false)}
            aria-pressed={!analyticsChoice}
            className="min-h-11 rounded-md border border-slate-500 px-5 py-2 font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Reject Analytics
          </button>
        </div>
        <p aria-live="polite" className="min-h-6 text-sm text-slate-700">
          {saved ? 'Your Analytics preference has been saved.' : ''}
        </p>
      </section>
    </article>
  );
}
