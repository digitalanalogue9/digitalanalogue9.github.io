// src/app/about/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { clearGameState } from "@/lib/utils/storage";
import { getLocalStorage, setLocalStorage } from "@/lib/utils/localStorage";
import { useMobile } from "@/components/common/MobileProvider";
import { getResponsiveTextStyles, getContainerClassName } from "@/lib/utils/styles/textStyles";
import { useConsent } from "@/lib/hooks/useConsent";
import Link from 'next/link';
import { ConsentStatus } from '@/lib/types/Consent';

const appVersion = process.env.NEXT_PUBLIC_VERSION || '0.0.0';

export default function About() {
  const [showInstructions, setShowInstructions] = useState(true);
  const { consent, updateConsent } = useConsent();
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  useEffect(() => {
    clearGameState();
  }, []);

  useEffect(() => {
    const savedPreference = getLocalStorage('show-instructions', true);
    setShowInstructions(savedPreference !== false);
  }, []);

  const handleToggleInstructions = () => {
    const newValue = !showInstructions;
    setShowInstructions(newValue);
    setLocalStorage('show-instructions', newValue ? true : false);
  };

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
      aria-labelledby="about-heading"
      className={`max-w-4xl ${getContainerClassName(isMobile)}`}
    >
      <div className="text-center">
        <h1
          id="about-heading"
          className={`${styles.heading} font-extrabold mb-4 sm:mb-6 whitespace-nowrap`}
        >
          About Core <span className="text-blue-700">Values</span>
        </h1>
        <div
          className={`max-w-2xl mx-auto ${styles.spacing}`}
          aria-label="Version"
        >
          <p className={`${styles.largeParagraph} text-black font-medium`}>
            Version {appVersion}
          </p>
        </div>
      </div>

      <section aria-labelledby="why-matters-heading" className="pt-2">
        <h2 id="why-matters-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
          Why Core Values Matter
        </h2>
        <div className={`bg-purple-100 p-4 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
          <p className={styles.paragraph}>
            Understanding your core values is essential for making meaningful life decisions
            and living authentically. This app helps you explore and organise your values
            through an interactive and thoughtful process.


            {!isMobile && (`
            Whether you are at a crossroads in life, planning your future, or simply want
            to better understand yourself, identifying your core values provides a compass
            for decision-making and personal growth.`
            )}
          </p>
        </div>
      </section>

      <section aria-labelledby="how-it-works-heading" className="pt-2">
        <h2 id="how-it-works-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
          How to Play
        </h2>
        <div className="space-y-4" role="list">
          {[
            {
              icon: "📝",
              title: "Step 1: Identify Values",
              description: "Start by selecting the number of core values that you want to finish with.  The default is 10 - the lower you go, the harder this exercise will be.",
              bgColor: "bg-green-100",
              textColor: "text-green-900"
            },
            {
              icon: "🔍",
              title: "Step 2: Prioritise",
              description: "For each value, you will need to move the card to an importance category. This helps you see which values are most significant to you and which are not important.  When you have played through all the values, any values in the 'Not Important' category will be removed and you start again with less values.  Keep going until you have the number of values you selected in Step 1.  You will then be asked why you chose these values.",
              bgColor: "bg-green-100",
              textColor: "text-green-900"
            },
            {
              icon: "💡",
              title: "Step 3: Review",
              description: "Periodically review and update your values as you grow and your circumstances change. This ensures that your values remain aligned with your current life.",
              bgColor: "bg-green-100",
              textColor: "text-green-900"
            }
          ].map((step) => (
            <div
              key={step.title}
              className={`${step.bgColor} p-4 rounded-lg`}
              role="listitem"
            >
              <h3 className={`${styles.paragraph} ${step.textColor} font-semibold mb-2`}>
                <span aria-hidden="true">{step.icon} </span>{step.title}
              </h3>
              <p className={styles.paragraph}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="privacy-heading" className="pt-2">
        <h2 id="privacy-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
          Your Data
        </h2>
        <div className="space-y-4" role="list">
          <div className="bg-blue-100 p-4 rounded-lg" role="listitem">
            <h3 className={`${styles.paragraph} font-semibold text-blue-900 mb-2`}>
              <span aria-hidden="true">🔒 </span>Secure Analytics
            </h3>
            <p className={styles.paragraph}>
              This app uses Google Analytics to track anonymous usage data, such as page views and time spent, to improve the user experience. For detailed information on how your data is handled, please visit our <Link href="/privacy" className="text-blue-700 hover:text-blue-800 transition-colours">Privacy Policy</Link>.
            </p>
            <div className="flex gap-2 justify-center">
              {consent.analytics === 'granted' ? (
                <button
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleConsent('denied')}
                >
                  Stop tracking
                </button>
              ) : (
                <button
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => handleConsent('granted')}
                >
                  Allow tracking
                </button>
              )}
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg" role="listitem">
            <h3 className={`${styles.paragraph} font-semibold text-blue-900 mb-2`}>
              <span aria-hidden="true">⚡ </span>Works Offline
            </h3>
            <p className={styles.paragraph}>
              Your selections and progress are stored locally on your device, ensuring your data remains private and accessible only to you.  All functionality works offline, so you can use the app anywhere without an internet connection.
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg" role="listitem">
            <h3 className={`${styles.paragraph} font-semibold text-blue-900 mb-2`}>
              <span aria-hidden="true">⚠️ </span>Important Note
            </h3>
            <p className={styles.paragraph}>
              If you clear your browser data or uninstall the app, your locally stored information will be deleted.
            </p>
          </div>
        </div>
        <p className={`${styles.paragraph} mt-4 text-black`}>

        </p>
      </section>

      <section aria-labelledby="instructions-heading" className="pt-2">
        <h2 id="instructions-heading" className={`${styles.subheading} font-bold text-black pb-2`}>
          Instructions Preference
        </h2>
        <div
          className="bg-purple-100 p-4 rounded-lg"
          role="group"
          aria-labelledby="instructions-heading"
        >
          <div
            className={`${styles.paragraph} flex items-center gap-3`}
            role="group"
            aria-labelledby="instructions-label"
          >
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="show-instructions"
                  checked={showInstructions}
                  onChange={handleToggleInstructions}
                  className="rounded border-gray-300 text-blue-700 focus:ring-blue-600 mt-2"
                  aria-describedby="instructions-description"
                  aria-checked={showInstructions}
                />
              </div>
              <div className="ml-3">
                <label
                  id="instructions-label"
                  htmlFor="show-instructions"
                  className="font-medium text-black"
                >
                  Show instructions when starting the exercise
                </label>
                <p
                  id="instructions-description"
                  className="text-black mt-2"
                >
                  {showInstructions
                    ? "Instructions will appear at the start of each new exercise"
                    : "Instructions will not appear automatically. You can change this setting at any time"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
