'use client';

import { getLocalStorage, setLocalStorage } from '@/lib/utils/localStorage';
import React, { useEffect, useState } from 'react';

export default function PrivacyPolicy() {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [cookieConsent, setCookieConsent] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add event listener for window resizing
        window.addEventListener('resize', checkMobile);

        // Cleanup event listener
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    useEffect(() => {
        const storedCookieConsent = getLocalStorage("cookie-consent", null);

        setCookieConsent(storedCookieConsent);
    }, [setCookieConsent]);

    useEffect(() => {
        const newValue = cookieConsent ? "granted" : "denied";

        window.gtag("consent", "update", {
            analytics_storage: newValue,
        });

        setLocalStorage("cookie-consent", cookieConsent);
    }, [cookieConsent]);
    return (
        <div
            role="main"
            aria-labelledby="privacy-policy-heading"
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            <h1
                id="privacy-policy-heading"
                className={`${isMobile ? 'text-2xl' : 'text-4xl sm:text-5xl'
                    } font-extrabold text-center mb-4 sm:mb-6 whitespace-nowrap`}
            >
                Core <span className="text-blue-700">Values</span> Privacy Policy
            </h1>
            <section aria-labelledby="introduction-heading" className="mb-8">
                <h2 id="introduction-heading" className="text-2xl font-bold text-black pb-4">
                    Introduction
                </h2>
                <p className="text-black text-lg">
                    At <strong>Core Values</strong>, your privacy is our priority. This policy explains
                    how we collect, use, and protect your information when you use our app or visit our
                    website.
                </p>
            </section>

            <section aria-labelledby="data-collection-heading" className="mb-8">
                <h2 id="data-collection-heading" className="text-2xl font-bold text-black pb-4">
                    Data Collection
                </h2>
                <p className="text-black text-lg">
                    We collect minimal data to improve the user experience. Specifically, we use Google
                    Analytics to track anonymous usage statistics, such as:
                </p>
                <ul className="list-disc pl-6 text-black">
                    <li>Pages viewed</li>
                    <li>Time spent on pages</li>
                    <li>Device type and operating system</li>
                    <li>General location (country-level)</li>
                </ul>
                <p className="text-black text-lg mt-4">
                    No personally identifiable information (PII), such as names or email addresses, is
                    collected.
                </p>
            </section>

            <section aria-labelledby="google-analytics-heading" className="mb-8">
                <h2 id="google-analytics-heading" className="text-2xl font-bold text-black pb-4">
                    Google Analytics
                </h2>
                <p className="text-black text-lg">
                    We use Google Analytics to understand how users interact with our app. To comply
                    with privacy regulations, we have taken the following measures:
                </p>
                <ul className="list-disc pl-6 text-black">
                    <li>IP anonymization is enabled to mask users' IP addresses.</li>
                    <li>
                        Advertising and remarketing features are disabled to ensure no targeted ads are
                        served based on your usage.
                    </li>
                    <li>
                        Analytics storage is only activated after you consent via our cookie banner.
                    </li>
                    <li>
                        Data sharing with Google or third parties is disabled wherever possible.
                    </li>
                </ul>
            </section>

            <section aria-labelledby="consent-management-heading" className="mb-8">
                <h2 id="consent-management-heading" className="text-2xl font-bold text-black pb-4">
                    Consent Management
                </h2>
                <p className="text-black text-lg">
                    You have control over your data and can manage your consent preferences through the
                    cookie banner or the Analytics section on the About page. If you choose to decline,
                    no analytics data will be collected.
                </p>
                <p className="text-black text-lg mt-4">
                    To adjust your preferences at any time, click the button below:
                </p>
                <div className="flex gap-2 justify-center">
                    {cookieConsent && <button
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => setCookieConsent(false)}
                    >
                        Stop tracking
                    </button>}
                    {!cookieConsent && <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        onClick={() => setCookieConsent(true)}
                    >
                        Allow tracking
                    </button>}
                </div>
            </section>

            <section aria-labelledby="data-retention-heading" className="mb-8">
                <h2 id="data-retention-heading" className="text-2xl font-bold text-black pb-4">
                    Data Retention
                </h2>
                <p className="text-black text-lg">
                    Google Analytics retains data for a maximum of 14 months. After this period, data is
                    automatically deleted. You can learn more about Google’s data retention policies on
                    their website.
                </p>
            </section>

            <section aria-labelledby="third-party-links-heading" className="mb-8">
                <h2 id="third-party-links-heading" className="text-2xl font-bold text-black pb-4">
                    Third-Party Links
                </h2>
                <p className="text-black text-lg">
                    Our app may contain links to external websites. Please note that we are not
                    responsible for the privacy practices of third-party sites. We encourage you to
                    review their privacy policies.
                </p>
            </section>

            <section aria-labelledby="user-rights-heading" className="mb-8">
                <h2 id="user-rights-heading" className="text-2xl font-bold text-black pb-4">
                    Your Rights
                </h2>
                <p className="text-black text-lg">
                    Under GDPR and other privacy laws, you have the right to:
                </p>
                <ul className="list-disc pl-6 text-black">
                    <li>Access the data we collect about you.</li>
                    <li>Request the deletion of your data.</li>
                    <li>Withdraw your consent at any time.</li>
                </ul>
                <p className="text-black text-lg mt-4">
                    To exercise these rights, please contact us via the email provided below.
                </p>
            </section>

            <section aria-labelledby="contact-heading" className="mb-8">
                <h2 id="contact-heading" className="text-2xl font-bold text-black pb-4">
                    Contact Us
                </h2>
                <p className="text-black text-lg">
                    If you have any questions or concerns about this privacy policy, please reach out to
                    us at:
                </p>
                <p className="text-black font-medium">
                    <a
                        href="mailto:corevaluesanalytics@gmail.com"
                        className="text-blue-700 underline"
                    >
                        corevaluesanalytics@gmail.com
                    </a>
                </p>
            </section>
        </div>
    );
}
