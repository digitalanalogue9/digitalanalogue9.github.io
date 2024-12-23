"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/hooks/useConsent";
import { ConsentStatus } from "@/lib/types/Consent";

export default function CookieBanner() {
  const { consent, updateConsent, isInitialized } = useConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInitialized && consent.analytics === 'pending') {
      setIsVisible(true);
    }
  }, [isInitialized, consent.analytics]);

  const handleConsent = (status: ConsentStatus) => {
    updateConsent(status);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900 bg-opacity-95 shadow-lg"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div className="flex-1 space-y-2">
            <h2 id="cookie-consent-title" className="text-xl font-semibold text-white">
              Cookie Preferences
            </h2>
            <p id="cookie-consent-description" className="text-gray-300">
              We use cookies to enhance your browsing experience and analyze our traffic.
              <Link
                href="/privacy"
                className="ml-1 text-blue-400 hover:text-blue-300 underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more about our Privacy Policy
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleConsent('denied')}
              className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Decline all cookies"
            >
              Decline All
            </button>
            <button
              onClick={() => handleConsent('granted')}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Accept all cookies"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
