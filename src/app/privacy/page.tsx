import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsent } from '@/lib/hooks/useConsent';

export default function PrivacyPage() {
  const { consent, updateConsent, isInitialized } = useConsent();
  const [saved, setSaved] = useState(false);

  const saveAnalyticsChoice = (granted: boolean) => {
    updateConsent({ analytics: granted ? 'granted' : 'denied', advertisement: 'denied' });
    setSaved(true);
  };

  const currentChoice =
    !isInitialized || consent.analytics === 'pending'
      ? 'Not set'
      : consent.analytics === 'granted'
        ? 'Allowed'
        : 'Rejected';

  return (
    <article className="mx-auto max-w-prose space-y-10 px-5 py-8 sm:px-8" aria-labelledby="privacy-heading">
      <header className="space-y-4">
        <p className="text-sys-color-text-secondary text-sm font-semibold tracking-wide uppercase">Privacy</p>
        <h1 id="privacy-heading" className="font-serif text-4xl leading-tight sm:text-5xl">
          Your reflections stay in this browser.
        </h1>
        <p className="text-sys-color-text-secondary text-lg leading-relaxed">
          Exercise answers and notes are stored on this device. They don’t sync automatically. Optional Google Analytics
          loads only if you allow it.
        </p>
      </header>

      <section aria-labelledby="saved-data-heading" className="space-y-3">
        <h2 id="saved-data-heading" className="font-serif text-2xl font-semibold">
          Saved exercises and preferences
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Your values exercises are saved in this browser’s IndexedDB storage. Behaviour reflection choices and notes,
          display preferences and your consent choice are also stored in browser storage on this device.
        </p>
        <p className="text-sys-color-text-secondary leading-relaxed">
          The app doesn’t send your exercise values, choices or notes to a server. Saved work doesn’t sync between
          browsers or devices. Clearing this site’s browser data can remove it, along with your preferences.
        </p>
      </section>

      <section aria-labelledby="backups-heading" className="space-y-3">
        <h2 id="backups-heading" className="font-serif text-2xl font-semibold">
          Exporting and importing backups
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Use History to export a backup before clearing browser data or moving your work. In History,{' '}
          <strong>Export</strong> saves your values exercise without the additional notes from the completed exercise
          page. Choose <strong>Export reflection backup</strong> to include those notes.
        </p>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Backup files are saved wherever your browser downloads files. Keep them private and delete them when you no
          longer need them. Imported values backups are added to History in this browser. Importing a values backup with
          an existing Session ID creates a separate copy. Restoring a behaviour reflection backup with an existing ID
          replaces that saved reflection and may replace newer work.
        </p>
      </section>

      <section aria-labelledby="analytics-heading" className="space-y-3">
        <h2 id="analytics-heading" className="font-serif text-2xl font-semibold">
          Optional Google Analytics
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          If you allow analytics, this site loads Google Analytics property G-JZPX5JCP5D and sends page views. Page URLs
          and referrers omit query strings and fragments, so Session identifiers in links aren’t included.
        </p>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Exercise values, choices, notes and imported or exported backup contents aren’t sent. Google may process
          standard browser and device information under its own privacy terms. It may also use cookies or similar
          technologies after you consent.
        </p>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Analytics doesn’t load before consent. Advertising features and Google Signals are disabled. Rejecting or
          withdrawing consent stops further page views. It doesn’t remove information Google has already collected.
        </p>
      </section>

      <section aria-labelledby="manage-consent-heading" className="space-y-4">
        <h2 id="manage-consent-heading" className="font-serif text-2xl font-semibold">
          Your analytics choice
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Your current choice is <strong>{currentChoice}</strong>. You can change it at any time.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveAnalyticsChoice(true)}
            aria-pressed={isInitialized && consent.analytics === 'granted'}
            className="apc-button min-h-11 px-5 py-2"
          >
            Allow analytics
          </button>
          <button
            type="button"
            onClick={() => saveAnalyticsChoice(false)}
            aria-pressed={isInitialized && consent.analytics === 'denied'}
            className="rounded-sys-radius-button-sm border-sys-color-border-strong hover:bg-ref-color-brand-primary-hover focus-visible:outline-ref-color-brand-primary min-h-11 border px-5 py-2 font-semibold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Reject analytics
          </button>
        </div>
        <p role="status" className="text-interface-base-small text-sys-color-text-secondary min-h-6">
          {saved ? 'Your analytics preference has been saved.' : ''}
        </p>
      </section>

      <section aria-labelledby="privacy-contact-heading" className="space-y-3">
        <h2 id="privacy-contact-heading" className="font-serif text-2xl font-semibold">
          Questions or privacy requests
        </h2>
        <p className="text-sys-color-text-secondary leading-relaxed">
          Email <a href="mailto:corevaluesanalytics@gmail.com">corevaluesanalytics@gmail.com</a> with a question about
          this notice or a privacy request.
        </p>
      </section>

      <p>
        <Link className="apc-button inline-flex min-h-11 items-center px-5 py-2" to="/exercise">
          Find my core values
        </Link>
      </p>
    </article>
  );
}
