// src/app/about/page.tsx
'use client'

import React, { useEffect, useState } from 'react';

const appVersion = process.env.NEXT_PUBLIC_VERSION || '0.0.0';

export default function About() {
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const savedPreference = localStorage.getItem('showInstructions');
    setShowInstructions(savedPreference !== 'false');
  }, []);

  const handleToggleInstructions = () => {
    const newValue = !showInstructions;
    setShowInstructions(newValue);
    localStorage.setItem('showInstructions', newValue ? 'true' : 'false');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="max-w-3xl mx-auto p-6 space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              About Core Values
            </h1>
            <p className="text-xl text-gray-700">
              Discover and prioritise what matters most to you
            </p>
            <p className="text-sm text-gray-500 mt-2" aria-label="Application version">
              Version {appVersion}
            </p>
          </div>
          <section aria-labelledby="why-matters-heading">
            <h2 id="why-matters-heading" className="text-2xl font-bold text-gray-900">
              Why Core Values Matter
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                Understanding your core values is essential for making meaningful life decisions
                and living authentically. This app helps you explore and organize your values
                through an interactive and thoughtful process.
              </p>
              <p>
                Whether you are at a crossroads in life, planning your future, or simply want
                to better understand yourself, identifying your core values provides a compass
                for decision-making and personal growth.
              </p>
            </div>
          </section>

          <section aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-2xl font-bold text-gray-900">
              How It Works
            </h2>
            <div
              className="grid gap-4 md:grid-cols-3"
              role="list"
            >
              {[
                {
                  title: "1. Explore",
                  description: "Browse through carefully curated value cards and begin sorting them based on their importance to you."
                },
                {
                  title: "2. prioritise",
                  description: "Organize values into categories, helping you identify which ones resonate most strongly with your personal beliefs."
                },
                {
                  title: "3. Reflect",
                  description: "Review your choices and gain insights into what truly matters to you, helping guide future decisions."
                }
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  role="listitem"
                >
                  <div className="text-blue-700 text-xl mb-2">{step.title}</div>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="benefits-heading">
            <h2 id="benefits-heading" className="text-2xl font-bold text-gray-900">
              Benefits
            </h2>
            <div
              className="grid gap-4 md:grid-cols-2"
              role="list"
            >
              {[
                {
                  icon: "🎯",
                  title: "Clear Decision Making",
                  description: "Use your identified values as a framework for making choices that align with what truly matters to you."
                },
                {
                  icon: "🧭",
                  title: "Personal Growth",
                  description: "Gain deeper self-awareness and understanding of your motivations and priorities."
                },
                {
                  icon: "🤝",
                  title: "Better Relationships",
                  description: "Communicate your values clearly to others and understand what drives your interactions."
                },
                {
                  icon: "⚡",
                  title: "Increased Motivation",
                  description: "Align your goals with your values for more meaningful and sustainable motivation."
                }
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-gray-100 p-4 rounded-lg"
                  role="listitem"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    <span aria-hidden="true">{benefit.icon} </span>
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="privacy-heading">
            <h2 id="privacy-heading" className="text-2xl font-bold text-gray-900">
              Your Data & Privacy
            </h2>
            <div
              className="space-y-4"
              role="list"
            >
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
              ].map((item) => (
                <div
                  key={item.title}
                  className={`${item.bgColor} p-4 rounded-lg`}
                  role="listitem"
                >
                  <h3 className={`font-semibold ${item.textColor} mb-2`}>
                    <span aria-hidden="true">{item.icon} </span>
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="notes-heading">
            <h2 id="notes-heading" className="sr-only">Important Notes</h2>
            <div className="space-y-4">
              <div
                className="bg-red-100 p-4 rounded-lg"
                role="alert"
              >
                <h3 className="font-semibold text-red-900 mb-2">
                  <span aria-hidden="true">⚠️ </span>
                  Important Note
                </h3>
                <p className="text-gray-700">
                  If you clear your browser data or uninstall the app, your stored
                  information will be deleted. Consider taking screenshots or noting down
                  important results if you want to keep them long-term.
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  <span aria-hidden="true">💡 </span>
                  Pro Tip
                </h3>
                <p className="text-gray-700">
                  For the best experience, install this as an app on your device
                  (look for the Install App button in your browser). This makes it easier
                  to access and use, just like any other app on your device!
                </p>
              </div>
            </div>
          </section>
          <section aria-labelledby="instructions-heading">
            <h2 id="instructions-heading" className="text-2xl font-bold text-gray-900">
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
                  <div className="ml-3 text-sm">
                    <label
                      id="instructions-label"
                      htmlFor="show-instructions"
                      className="font-medium text-gray-900"
                    >
                      Show instructions when starting the exercise
                    </label>
                    <p
                      id="instructions-description"
                      className="text-gray-700 mt-2"
                    >
                      <span className="sr-only">
                        Current status:
                      </span>
                      {showInstructions
                        ? "Instructions will be shown when you start a new exercise."
                        : "Instructions are currently hidden. Enable this to see them again."}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mt-4 text-sm text-gray-500"
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
      </div>
    </div>
  );
}
