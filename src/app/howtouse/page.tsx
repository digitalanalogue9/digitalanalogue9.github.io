// src/app/about/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { clearGameState } from '@/lib/utils/storage';
import { getLocalStorage, setLocalStorage } from '@/lib/utils/localStorage';
import { useMobile } from '@/lib/contexts/MobileContext';
import { getResponsiveTextStyles, getContainerClassName } from '@/lib/utils/styles/textStyles';


export default function About() {
  const [showInstructions, setShowInstructions] = useState(true);
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  useEffect(() => {
    document.title = 'Core Values - How to use';
  }, []);

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

  return (
    <div aria-labelledby="about-heading" className={`max-w-4xl ${getContainerClassName(isMobile)}`}>
      <div className="text-center">
        <h1 id="about-heading" className={`${styles.heading} mb-4 whitespace-nowrap font-extrabold sm:mb-6`}>
          Using Core <span className="text-blue-700">Values</span>
        </h1>
      </div>

      <section aria-labelledby="how-it-works-heading" className="pt-2">
        <h2 id="how-it-works-heading" className={`${styles.subheading} pb-2 font-bold text-black`}>
          How to Play
        </h2>
        <div className="space-y-4" role="list">
            {[
            {
              icon: '🔢',
              title: 'Step 1: Choose how many values',
              description:
              'Start by selecting the number of core values that you want to finish with.  The default is 10 - the lower you go, the harder this exercise will be.',
              bgColor: 'bg-green-100',
              textColor: 'text-green-900',
            },
            {
              icon: '📊',
              title: 'Step 2: Prioritise your values',
              description:
              "For each value, you will need to move the card to an importance category. This helps you see which values are most significant to you and which are not important.  When you have played through all the values, any values in the 'Not Important' category will be removed and you start again with less values.  Keep going until you have the number of values you selected in Step 1.",
              bgColor: 'bg-green-100',
              textColor: 'text-green-900',
            },
            {
              icon: '💬',
              title: 'Step 3: Make it real',
              description:
              "You will then be asked why you chose these values.  Whilst this an optional step, it's a good idea to do this as it will help you understand why you have chosen these values and how they will help you in your life.",
              bgColor: 'bg-green-100',
              textColor: 'text-green-900',
            },
            {
              icon: '🔄',
              title: 'Step 4: Review and update',
              description:
              'Periodically review and update your values as you grow and your circumstances change. This ensures that your values remain aligned with your current life.',
              bgColor: 'bg-green-100',
              textColor: 'text-green-900',
            },
            ].map((step) => (
            <div key={step.title} className={`${step.bgColor} rounded-lg p-4`} role="listitem">
              <h3 className={`${styles.paragraph} ${step.textColor} mb-2 font-semibold`}>
              <span aria-hidden="true">{step.icon} </span>
              {step.title}
              </h3>
              <p className={styles.paragraph}>{step.description}</p>
            </div>
            ))}
        </div>
      </section>

      <section aria-labelledby="instructions-heading" className="pt-2">
        <h2 id="instructions-heading" className={`${styles.subheading} pb-2 font-bold text-black`}>
          Instructions Preference
        </h2>
        <div className="rounded-lg bg-purple-100 p-4" role="group" aria-labelledby="instructions-heading">
          <div
            className={`${styles.paragraph} flex items-center gap-3`}
            role="group"
            aria-labelledby="instructions-label"
          >
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  id="show-instructions"
                  checked={showInstructions}
                  onChange={handleToggleInstructions}
                  className="mt-2 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                  aria-describedby="instructions-description"
                  aria-checked={showInstructions}
                />
              </div>
              <div className="ml-3">
                <label id="instructions-label" htmlFor="show-instructions" className="font-medium text-black">
                  Show instructions when starting the exercise
                </label>
                <p id="instructions-description" className="mt-2 text-black">
                  {showInstructions
                    ? 'Instructions will appear at the start of each new exercise'
                    : 'Instructions will not appear automatically. You can change this setting at any time'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
