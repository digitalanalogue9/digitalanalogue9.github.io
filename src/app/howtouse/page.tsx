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
          How to use <span className="text-blue-700">Core Values</span>
        </h1>
      </div>
      <div className="space-y-4" role="list">
        {[
          {
            icon: '🔢',
            id: 'choose-your-values',
            title: 'Step 1: Choose how many values',
            description:
              'Start by selecting the number of core values that you want to finish with.  The default is 10.  The lower you go, the harder the exercise will be.',
            bgColor: 'bg-purple-100',
            textColor: 'text-green-900',
          },
          {
            icon: '📊',
            id: 'prioritise-your-values',
            title: 'Step 2: Prioritise your values',
            description:
              "For each value, you will need to decide how important it is too you and move the card to the appropriate category. This helps you see which values are most significant to you and which are not important.  When you have played through all the values, any values in the 'Not Important' category will be removed and you start again with less values.  Keep going until you have the number of values you want to get to.",
            bgColor: 'bg-blue-100',
            textColor: 'text-green-900',
          },
          {
            icon: '💬',
            id: 'explain-your-values',
            title: 'Step 3: Explain your choices',
            description:
              "You will then be asked why you chose these values.  Whilst this an optional step, it's a good idea to do this as it will help you remember why you chose these values.",
            bgColor: 'bg-green-100',
            textColor: 'text-green-900',
          },
          {
            icon: '🔄',
            id: 'review-your-values',
            title: 'Step 4: Review and update',
            description:
              'Periodically review and update your values as you grow and your circumstances change. This ensures that your values remain aligned with your current life.',
            bgColor: 'bg-purple-100',
            textColor: 'text-green-900',
          },
        ].map((step) => (
          <section key={step.id} aria-labelledby={`${step.id}-heading`} className="pt-2">
            <h2 id={`${step.id}-heading`} className={`${styles.subheading} pb-2 text-center font-bold text-black`}>
              <span aria-hidden="true">{step.icon} </span> {step.title}
            </h2>
            <div className={`rounded-lg border border-gray-100 ${step.bgColor} p-4 shadow-sm ${styles.prose} text-black`}>
              <p className={styles.paragraph}>{step.description}</p>
            </div>
          </section>
        ))}
      </div>
      <section aria-labelledby="user-rights-heading" className="pt-2">
        <h2 id="user-rights-heading" className={`${styles.subheading} pb-2 text-center font-bold text-black`}>
          <span aria-hidden="true">❓ </span> Want a reminder when you play?
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-blue-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <div className="flex h-5 items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                id="show-instructions"
                checked={showInstructions}
                onChange={handleToggleInstructions}
                className="mt-2 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                aria-describedby="instructions-description"
                aria-checked={showInstructions}
              />
              <span className="ml-2 mt-2">Show instructions when starting the exercise</span>
            </label>
          </div>
          <p id="instructions-description" className="mt-2 text-black">
            {showInstructions
              ? 'Instructions will appear at the start of each new exercise.'
              : 'Instructions will not appear automatically.'}
          </p>
        </div>
      </section>
    </div>
  );
}
