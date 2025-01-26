'use client';

import { useMobile } from '@/lib/contexts/MobileContext';
import { useConsent } from '@/lib/hooks/useConsent';
import { ConsentStatus } from '@/lib/types/Consent';
import { getContainerClassName, getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';
import React, { useEffect } from 'react';

export default function PrivacyPolicy() {
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  const { consent, updateConsent } = useConsent();

  useEffect(() => {
    document.title = 'Core Values - Privacy';
  }, []);

  const handleConsent = (status: ConsentStatus) => {
    updateConsent({
      analytics: status,
      functional: status,
      advertisement: 'denied',
      timestamp: Date.now(),
    });
  };

  return (
    <div className={`max-w-4xl ${getContainerClassName(isMobile)}`} aria-labelledby="privacy-policy-heading">
      <div className="text-center">
        <h1 id="privacy-policy-heading" className={`${styles.heading} mb-4 whitespace-nowrap font-extrabold sm:mb-6`}>
          <span className="text-blue-700">Core Values</span> Privacy Policy
        </h1>
      </div>
      <section aria-labelledby="introduction-heading" className="pt-2">
        <h2 id="introduction-heading" className={`${styles.subheading} pb-2 font-bold text-black text-center`}>
          <span aria-hidden="true">🔒 </span>Why you can trust us
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-purple-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`${styles.paragraph} text-black`}>
            At <strong>Core Values</strong>, your privacy is our priority. This policy explains how we collect, use, and
            protect your information when you use our app or visit our website.
          </p>
        </div>
      </section>
      <section aria-labelledby="application-data-heading" className="pt-2">
        <h2 id="application-data-heading" className={`${styles.subheading} pb-2 font-bold text-black text-center`}>
          <span aria-hidden="true">📋 </span>Core Values data
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-blue-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`${styles.paragraph} text-black`}>
            Data is all stored locally on your device and is never transmitted to our servers.  You can choose to export your data to a file if you wish to keep a copy of your sessions.
          </p>
        </div>
      </section>

      <section aria-labelledby="google-analytics-heading" className="pt-2">
        <h2 id="google-analytics-heading" className={`${styles.subheading} pb-2 font-bold text-black text-center`}>
          <span aria-hidden="true">📊 </span>Google Analytics
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-green-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`${styles.paragraph} text-black`}>
            We use Google Analytics to understand how users interact with our app. No personally identifiable information (PII), such as names or email addresses, is collected. Any data
            collected is anonymised and cannot be linked to individual users.
          </p>
          <ul className={`list-disc pl-6 text-black ${styles.paragraph}`}>
            <li>IP anonymisation is enabled to mask users&apos; IP addresses.</li>
            <li>
              Advertising and remarketing features are disabled to ensure no targeted ads are served based on your
              usage.
            </li>
            <li>Analytics tracking is only activated after you provide explicit consent via the cookie banner.</li>
            <li>Data sharing with Google or third parties is disabled wherever possible.</li>
          </ul>

          <p className={`${styles.paragraph} text-black`}>
            Specifically, we track anonymous usage data, such as:
          </p>
          <ul className={`list-disc pl-6 text-black ${styles.paragraph}`}>
            <li>Pages viewed</li>
            <li>Time spent on pages</li>
            <li>Device type and operating system</li>
            <li>General location (country-level)</li>
          </ul>
        </div>
      </section>
      <section aria-labelledby="data-retention-heading" className="pt-2">
        <h2 id="data-retention-heading" className={`${styles.subheading} pb-2 font-bold text-black text-center`}>
          <span aria-hidden="true">🗄️ </span>Data Retention
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-purple-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`${styles.paragraph} text-black`}>
            Google Analytics retains data for a maximum of 14 months. After this period, data is automatically deleted.
            Your consent preferences are stored locally on your device until you reset them or clear your browser data.
          </p>
        </div>
      </section>
      <section aria-labelledby="consent-management-heading" className="pt-2">
        <h2 id="consent-management-heading" className={`${styles.subheading} pb-2 font-bold text-black text-center`}>
          <span aria-hidden="true">✅ </span>Consent Management
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-blue-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`${styles.paragraph} text-black`}>
            You have full control over your data and can manage your consent preferences at any time. When you first use
            the app, you will see a cookie banner allowing you to grant or deny consent for analytics tracking.
          </p>
          <p className={`${styles.paragraph} mt-4 text-black`}>
            To adjust your preferences, use the button below:
          </p>
          <div className="mt-2 flex justify-center gap-2">
            {consent.analytics === 'granted' && (
              <button
                className="rounded-md bg-red-600 px-6 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => handleConsent('denied')}
              >
                Stop tracking
              </button>
            )}
            {consent.analytics !== 'granted' && (
              <button
                className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => handleConsent('granted')}
              >
                Allow tracking
              </button>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="user-rights-heading" className="pt-2">
        <h2 id="user-rights-heading" className={`${styles.subheading} pb-2 font-bold text-black text-center`}>
          <span aria-hidden="true">🛡️ </span>Your Rights
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-green-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`${styles.paragraph} text-black`}>Under GDPR and other privacy laws, you have the right to:</p>
          <ul className={`list-disc pl-6 text-black ${styles.paragraph}`}>
            <li>Access the data we collect about you.</li>
            <li>Request the deletion of your data.</li>
            <li>Withdraw your consent at any time.</li>
          </ul>
          <p className={`${styles.paragraph} mt-4 text-black`}>
            To exercise these rights, please contact us at{' '}
            <a href="mailto:corevaluesanalytics@gmail.com" className="text-blue-700 underline">
              corevaluesanalytics@gmail.com
            </a>
          </p>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="pt-2">
        <h2 id="contact-heading" className={`${styles.subheading} pb-2 font-bold text-black text-center`}>
          <span aria-hidden="true">📧 </span>Contact Us
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-purple-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`${styles.paragraph} text-black`}>
            If you have any questions or concerns about this privacy policy, feel free to reach out to us at{' '}
            <a href="mailto:corevaluesanalytics@gmail.com" className="text-blue-700 underline">
              corevaluesanalytics@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
