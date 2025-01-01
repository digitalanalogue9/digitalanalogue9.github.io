'use client';

import { useState, useCallback, useEffect } from 'react';
import { InstructionsProps } from './types';
import { useMobile } from '@/lib/contexts/MobileContext';

/**
 * Instructions component displays a modal with instructions on how to use the Core Values application.
 * It provides an option to not show the instructions again by saving the preference in localStorage.
 */
export default function Instructions({ onClose }: InstructionsProps) {
  const [shouldShowAgain, setShouldShowAgain] = useState(true);
  const { isMobile } = useMobile();
  useEffect(() => {
    const savedPreference = localStorage.getItem('show-instructions');
    if (savedPreference === 'false') {
      onClose();
    }
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (!shouldShowAgain) {
      localStorage.setItem('show-instructions', 'false');
    }
    onClose();
  }, [shouldShowAgain, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 p-2 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-xs overflow-y-auto rounded-lg border-2 border-black bg-white p-4 sm:max-w-sm sm:p-6 md:max-w-2xl">
        <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">How to Use Core Values</h2>
        <ol className="ml-4 list-decimal space-y-1 text-sm sm:ml-6 sm:space-y-2 sm:text-base">
          <li>You have already entered the number of core values you want to end up with (typically 10).</li>
          <li>For each round, you&apos;ll see value cards that you need to sort into categories.</li>
          <li>
            {isMobile
              ? 'Tap each card and then tap a category to select its importance level: Very Important, Quite Important, Important, Of Some Importance, or Not Important.'
              : 'Drag each card into one of the five categories based on its importance to you: Very Important, Quite Important, Important, Of Some Importance, or Not Important.'}
          </li>
          <li>
            {isMobile
              ? 'Use the + and - buttons to show/hide the card description.'
              : 'Click on a card or the + and - buttons to show/hide its description.'}
          </li>
          <li>Use the up/down arrows to reorder cards within a category.</li>
          <li>When you&apos;re done sorting all cards, click &quot;Next Round&quot;.</li>
          <li>In the next round, cards marked as &quot;Not Important&quot; will be removed.</li>
          <li>Continue sorting until you reach your target number of core values.</li>
          <li>If you&apos;re satisfied with your selection before reaching the target number, you can click &quot;Finish Early&quot;.</li>
          <li>You can use the replay button to apply your decision from the previous round.</li>
          <li>Then tell me why you chose your values.</li>
        </ol>

        <div className="mt-4 space-y-4 sm:mt-6">
          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              checked={!shouldShowAgain}
              onChange={(e) => setShouldShowAgain(!e.target.checked)}
              className="rounded border-gray-300 text-blue-700 focus:ring-blue-600"
            />
            <span className="text-sm">Don&apos;t show these instructions again</span>
          </label>

          <button
            aria-label="Confirm instructions understood and start exercise"
            onClick={handleClose}
            className="w-full rounded bg-blue-700 px-4 py-2 text-white transition-colors hover:bg-blue-600 sm:w-auto"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
