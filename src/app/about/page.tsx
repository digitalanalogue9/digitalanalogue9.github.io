// src/app/about/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { clearGameState } from "@/lib/utils/storage";
import { getLocalStorage, setLocalStorage } from "@/lib/utils/localStorage";
import { useMobile } from "@/lib/contexts/MobileContext";
import { getResponsiveTextStyles, getContainerClassName } from "@/lib/utils/styles/textStyles";
import { useConsent } from "@/lib/hooks/useConsent";
import Link from 'next/link';

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
    const savedPreference = localStorage.getItem('show-instructions');
    setShowInstructions(savedPreference !== 'false');
  }, []);

  const handleToggleInstructions = () => {
    const newValue = !showInstructions;
    setShowInstructions(newValue);
    localStorage.setItem('showInstructions', newValue ? 'true' : 'false');
  };

  return (
    <div
      role="main"
      aria-labelledby="about-heading"
      className={getContainerClassName(isMobile)}
    >
      <div className="text-center">
        <h1
          id="about-heading"
          className={`${isMobile ? 'text-2xl' : 'text-4xl sm:text-5xl'} font-extrabold mb-4 sm:mb-6 whitespace-nowrap`}
        >
          About Core <span className="text-blue-700">Values</span>
        </h1>
        <div
          className={`max-w-2xl mx-auto text- ${styles.spacing}`}
          aria-label="Version"
        >
          <p className={`${styles.largeParagraph} text-black font-medium`}>
            Version {appVersion}
          </p>
        </div>
      </div>

      <section aria-labelledby="why-matters-heading" className="pt-2">
        <h2 id="why-matters-heading" className={`${styles.subheading} font-bold text-black pb-2 text-center`}>
          Why Core Values Matter
        </h2>
        <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${styles.prose} text-black`}>
          <p className={styles.paragraph}>
            Understanding your core values is essential for making meaningful life decisions
            and living authentically. This app helps you explore and organise your values
            through an interactive and thoughtful process.
          </p>
          
          {!isMobile && (<p className={styles.paragraph}>
            Whether you are at a crossroads in life, planning your future, or simply want
            to better understand yourself, identifying your core values provides a compass
            for decision-making and personal growth.
          </p>)}
        </div>
      </section>

      <section aria-labelledby="how-it-works-heading" className="pt-2">
        <h2 id="how-it-works-heading" className={`${styles.subheading} font-bold text-black pb-2 text-center`}>
          How It Works
        </h2>
        <div className="grid gap-4 md:grid-cols-3" role="list">
          {[
              {
                icon: "📱",
                title: "Private & Local Storage",
                description: "All your selections and progress are stored directly on your device. Think of it like having a personal notebook that only exists on your phone or computer.",
                bgColor: "bg-blue-100",
                textColor: "text-blue-900"
              },
              {
                icon: "🔒",
                title: "Complete Privacy",
                description: "Your data never leaves your device - we do not use any external servers or cloud storage. Your personal journey stays completely private.",
                bgColor: "bg-green-100",
                textColor: "text-green-900"
              },
              {
                icon: "💾",
                title: "Automatic Saving",
                description: "Every change you make is automatically saved on your device. You can close the app and come back later - your progress will be waiting for you.",
                bgColor: "bg-purple-100",
                textColor: "text-purple-900"
              },
              {
                icon: "⚡",
                title: "Works Offline",
                description: "Because everything is stored on your device, you can use the app even without an internet connection. Perfect for deep reflection anywhere.",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-900"
              }
            ].map((step) => (
            <div
              key={step.title}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              role="listitem"
            >
              <div className={`${styles.largeParagraph} text-blue-700 mb-2`}>{step.title}</div>
              <p className={styles.paragraph}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="privacy-heading" className="pt-2">
        <h2 id="privacy-heading" className={`${styles.subheading} font-bold text-black pb-2 text-center`}>
          Your Data & Privacy
        </h2>
        <div className="space-y-4" role="list">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className={`${styles.paragraph} font-semibold text-blue-900 mb-2`}>
              <span aria-hidden="true">📱 </span>Private & Local Storage
            </h3>
            <p className={styles.paragraph}>
              Your selections and progress are stored locally on your device, ensuring your data remains private and accessible only to you.
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className={`${styles.paragraph} font-semibold text-green-900 mb-2`}>
              <span aria-hidden="true">🔒 </span>Secure Analytics
            </h3>
            <p className={styles.paragraph}>
              Anonymous usage data is collected only with your explicit consent to improve the app&apos;s experience. No personal information is shared or stored externally.
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className={`${styles.paragraph} font-semibold text-yellow-900 mb-2`}>
              <span aria-hidden="true">⚡ </span>Works Offline
            </h3>
            <p className={styles.paragraph}>
              All functionality works offline, so you can use the app anywhere without an internet connection.
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className={`${styles.paragraph} font-semibold text-red-900 mb-2`}>
              <span aria-hidden="true">⚠️ </span>Important Note
            </h3>
            <p className={styles.paragraph}>
              If you clear your browser data or uninstall the app, your locally stored information will be deleted.
            </p>
          </div>
        </div>
        <p className={`${styles.paragraph} mt-4 text-black`}>
          For detailed information on how your data is handled, please visit our <Link href="/privacy" className="text-blue-700 hover:text-blue-800 transition-colours">Privacy Policy</Link>.
        </p>
      </section>

      <section aria-labelledby="analytics-heading" className="pt-2" id="analytics">
        <h2 id="analytics-heading" className={`${styles.subheading} font-bold text-black pb-2 text-center`}>
          Analytics
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className={`${styles.paragraph} pb-2`}>
            This app uses Google Analytics to track anonymous usage data, such as page views and time spent, to improve the user experience. Analytics is only enabled after you provide consent via the cookie banner or Analytics section.
          </p>
          <div className="flex gap-2 justify-center">
            {consent.analytics === 'granted' ? (
              <button
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => updateConsent('denied')}
              >
                Stop tracking
              </button>
            ) : (
              <button
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => updateConsent('granted')}
              >
                Allow tracking
              </button>
            )}
          </div>
        </div>
      </section>
      
      <section aria-labelledby="instructions-heading" className="pt-2">
        <h2 id="instructions-heading" className="text-2xl font-bold text-black pb-2 text-center">
          Instructions Preference
        </h2>
        <div
          className="bg-gray-100 p-4 rounded-lg"
          role="group"
          aria-labelledby="instructions-heading"
        >
          <div
            className="flex items-center gap-3"
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
                  className="rounded border-gray-300 text-blue-700 focus:ring-blue-600"
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
                  <span className="sr-only">
                    Current status:
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            className="mt-4 text-black"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Preference saved: </span>
            {showInstructions
              ? "Instructions will appear at the start of each new exercise"
              : "Instructions will not appear automatically. You can change this setting at any time"}
          </div>
        </div>
      </section>
    </div>
  );
}
