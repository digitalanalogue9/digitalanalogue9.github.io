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
    <article className="border-sys-color-border-default bg-sys-color-surface-default mx-auto max-w-4xl space-y-8 rounded-lg border p-5 shadow-sm sm:p-8">
      <header className="text-sys-color-text-primary block bg-transparent p-0 shadow-none">
        <h1 className="mt-0 text-3xl font-bold sm:text-4xl">Privacy</h1>
        <p className="text-sys-color-text-secondary mt-3 text-base leading-relaxed">
          Core Values keeps your exercise work in this browser. Optional Google Analytics is off unless you allow it.
          This page explains what is stored and what changes when you give consent.
        </p>
      </header>

      <section aria-labelledby="local-data-heading" className="space-y-2">
        <h2 id="local-data-heading" className="text-xl font-semibold">
          Sessions and preferences on your device
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Values exercise Sessions are stored in this browser&apos;s IndexedDB storage. Scenario reflection choices,
          notes, display preferences, and your consent choice are stored in browser storage on this device. The app
          does not send your exercise values, choices, or notes to a server, and your Sessions are not synced between
          browsers or devices. Clearing this site&apos;s browser data can remove saved work and preferences. Use History
          to export a Session backup before clearing data or changing devices.
        </p>
      </section>

      <section aria-labelledby="analytics-heading" className="space-y-2">
        <h2 id="analytics-heading" className="text-xl font-semibold">
          Optional Google Analytics
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          If you allow Analytics, this site loads Google Analytics property G-JZPX5JCP5D and sends page views with
          page URLs and referrers that omit query strings and fragments, so Session identifiers in links are not
          included. Exercise values, choices, notes, and imported or exported backup contents are not sent. Google
          may process standard browser and device information under its own privacy terms, and may use its own cookies
          or similar technologies after you consent. Analytics is not loaded before consent; advertising features and
          Google Signals are disabled. Rejecting or withdrawing consent stops further page views, but does not remove
          information already collected by Google.
        </p>
      </section>

      <section aria-labelledby="retention-heading" className="space-y-2">
        <h2 id="retention-heading" className="text-xl font-semibold">
          Retention and backups
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          You control locally stored Sessions through this browser. Exported JSON backups are saved wherever your
          browser downloads files; keep them private and delete them when you no longer need them. Imported backups are
          added to this browser&apos;s local Session history.
        </p>
      </section>

      <section aria-labelledby="manage-consent-heading" className="space-y-3">
        <h2 id="manage-consent-heading" className="text-xl font-semibold">
          Manage Analytics consent
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Your current choice is{' '}
          <strong>{!isInitialized || consent.analytics === 'pending' ? 'not set' : consent.analytics}</strong>. You can
          change it at any time.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveAnalyticsChoice(true)}
            aria-pressed={analyticsChoice}
            className="apc-button min-h-11 px-5 py-2"
          >
            Allow Analytics
          </button>
          <button
            type="button"
            onClick={() => saveAnalyticsChoice(false)}
            aria-pressed={!analyticsChoice}
            className="rounded-sys-radius-button-sm border-sys-color-border-strong hover:bg-ref-color-brand-primary-hover focus-visible:outline-ref-color-brand-primary min-h-11 border px-5 py-2 font-semibold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Reject Analytics
          </button>
        </div>
        <p aria-live="polite" className="text-interface-base-small text-sys-color-text-secondary min-h-6">
          {saved ? 'Your Analytics preference has been saved.' : ''}
        </p>
      </section>

      <section aria-labelledby="privacy-contact-heading" className="space-y-2">
        <h2 id="privacy-contact-heading" className="text-xl font-semibold">
          Questions or privacy requests
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Contact the site owner at{' '}
          <a href="mailto:corevaluesanalytics@gmail.com">corevaluesanalytics@gmail.com</a> with questions about this
          notice or a privacy request.
        </p>
      </section>
    </article>
  );
}
