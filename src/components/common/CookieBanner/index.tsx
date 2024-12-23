"use client";

import { getLocalStorage, setLocalStorage } from "@/lib/utils/localStorage";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(false);

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
      className={`my-10 mx-auto max-w-max md:max-w-screen-sm
                  fixed bottom-0 left-0 right-0 
                  flex px-3 md:px-4 py-3 justify-between items-center flex-col sm:flex-row gap-4  
                  bg-gray-700 rounded-lg shadow z-50
                  ${cookieConsent ? "hidden" : "flex"}`}
    >
      <div className="text-center text-white-200">
        <Link href="/about#analytics" className="text-xl font-bold text-white no-underline hover:text-green-400 transition-colors"
        aria-label="Cookie Policy">
          <p>
            We use <span className="font-bold text-sky-400">cookies</span> on
            our site.
          </p>
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => setCookieConsent(false)}
        >
          Decline
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={() => setCookieConsent(true)}
        >
          Allow Cookies
        </button>
      </div>
    </div>
  );
}