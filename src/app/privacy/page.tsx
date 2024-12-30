'use client';

import { useMobile } from '../../components/common/MobileProvider';
import { useConsent } from "../../lib/hooks/useConsent";
import { ConsentStatus } from "../../lib/types/Consent";
import { getContainerClassName, getResponsiveTextStyles } from '../../lib/utils/styles/textStyles';
import React from 'react';

export default function PrivacyPolicy() {
    const { isMobile } = useMobile();
    const styles = getResponsiveTextStyles(isMobile);

    const { consent, updateConsent, isInitialized } = useConsent();

    const handleConsent = (status: ConsentStatus) => {
        updateConsent({
            analytics: status,
            functional: status,
            advertisement: 'denied',
            timestamp: Date.now()
        })
    };

    return (
        <div
            className={`max-w-4xl ${getContainerClassName(isMobile)}`}
            aria-labelledby="privacy-policy-heading"
        >
            <div className="text-center">
                <h1
                    id="privacy-policy-heading"
                    className={`${styles.heading} font-extrabold mb-4 sm:mb-6 whitespace-nowrap`}
                >
                    Core <span className="text-blue-700">Values</span> Privacy Policy
                </h1>
            </div>
            <section aria-labelledby="introduction-heading" className="pt-2">
                <h2 id="introduction-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
                    Introduction
                </h2>
                <div className={`bg-purple-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
                    <p className={`${styles.paragraph} text-black`}>
                        At <strong>Core Values</strong>, your privacy is our priority. This policy explains
                        how we collect, use, and protect your information when you use our app or visit our
                        website.
                    </p>
                </div>
            </section>
            <section aria-labelledby="google-analytics-heading" className="pt-2">
                <h2 id="google-analytics-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
                    Google Analytics
                </h2>
                <div className={`bg-blue-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
                    <p className={`${styles.paragraph} text-black`}>
                        We use Google Analytics to understand how users interact with our app. To comply
                        with privacy regulations, we have taken the following measures:
                    </p>
                    <ul className={`list-disc pl-6 text-black ${styles.paragraph}`}>
                        <li>IP anonymisation is enabled to mask users&apos; IP addresses.</li>
                        <li>Advertising and remarketing features are disabled to ensure no targeted ads are served based on your usage.</li>
                        <li>Analytics tracking is only activated after you provide explicit consent via the cookie banner.</li>
                        <li>Data sharing with Google or third parties is disabled wherever possible.</li>
                    </ul>
                </div>
            </section>

            <section aria-labelledby="data-collection-heading" className="pt-2">
                <h2 id="data-collection-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
                    Data Collection
                </h2>
                <div className={`bg-green-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
                    <p className={`${styles.paragraph} text-black`}>
                        We collect minimal data to improve the user experience. Specifically, we use Google
                        Analytics to track anonymous usage data, such as:
                    </p>
                    <ul className={`list-disc pl-6 text-black ${styles.paragraph}`}>
                        <li>Pages viewed</li>
                        <li>Time spent on pages</li>
                        <li>Device type and operating system</li>
                        <li>General location (country-level)</li>
                    </ul>
                    <p className={`${styles.paragraph} text-black`}>
                        No personally identifiable information (PII), such as names or email addresses, is
                        collected. Any data collected is anonymised and cannot be linked to individual users.
                    </p>
                </div>
            </section>
            <section aria-labelledby="consent-management-heading" className="pt-2">
                <h2 id="consent-management-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
                    Consent Management
                </h2>
                <div className={`bg-green-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
                    <p className={`${styles.paragraph} text-black`}>
                        You have full control over your data and can manage your consent preferences at any
                        time. When you first use the app, you will see a cookie banner allowing you to grant
                        or deny consent for analytics tracking.
                    </p>
                    <p className={`${styles.paragraph} text-black mt-4`}>
                        To adjust your preferences, visit the Analytics section on the About page or use
                        the buttons below:
                    </p>
                    <div className="flex gap-2 justify-center mt-2">
                        {consent.analytics === 'granted' && (
                            <button
                                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={() => handleConsent('denied')}
                            >
                                Stop tracking
                            </button>
                        )}
                        {consent.analytics !== 'granted' && (
                            <button
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                onClick={() => handleConsent('granted')}
                            >
                                Allow tracking
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section aria-labelledby="data-retention-heading" className="pt-2">
                <h2 id="data-retention-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
                    Data Retention
                </h2>
                <div className={`bg-blue-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
                    <p className={`${styles.paragraph} text-black`}>
                        Google Analytics retains data for a maximum of 14 months. After this period, data is
                        automatically deleted. Your consent preferences are stored locally on your device
                        until you reset them or clear your browser data.
                    </p>
                </div>
            </section>

            <section aria-labelledby="user-rights-heading" className="pt-2">
                <h2 id="user-rights-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
                    Your Rights
                </h2>
                <div className={`bg-green-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
                    <p className={`${styles.paragraph} text-black`}>
                        Under GDPR and other privacy laws, you have the right to:
                    </p>
                    <ul className={`list-disc pl-6 text-black ${styles.paragraph}`}>
                        <li>Access the data we collect about you.</li>
                        <li>Request the deletion of your data.</li>
                        <li>Withdraw your consent at any time.</li>
                    </ul>
                    <p className={`${styles.paragraph} text-black mt-4`}>
                        To exercise these rights, please contact us at <a href="mailto:corevaluesanalytics@gmail.com" className="text-blue-700 underline">
                            corevaluesanalytics@gmail.com
                        </a>
                    </p>
                </div>
            </section>

            <section aria-labelledby="contact-heading" className="pt-2">
                <h2 id="contact-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
                    Contact Us
                </h2>
                <div className={`bg-blue-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
                    <p className={`${styles.paragraph} text-black`}>
                        If you have any questions or concerns about this privacy policy, feel free to reach
                        out to us at <a href="mailto:corevaluesanalytics@gmail.com" className="text-blue-700 underline">
                            corevaluesanalytics@gmail.com
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
}
