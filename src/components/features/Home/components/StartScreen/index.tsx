'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEnvNumber, getEnvBoolean } from '@/lib/utils/config';
import { addSession } from '@/lib/db/indexedDB';
import { initializeGameState } from '@/lib/utils/storage';
import { initialCategories } from '@/components/features/Categories/constants/categories';
import valuesData from '@/data/values.json';
import { getRandomValues } from '@/components/features/Home/utils/valuesUtils';
import { useMobile } from '@/lib/contexts/MobileContext';
import { getResponsiveTextStyles, getContainerClassName } from '@/lib/utils/styles/textStyles';

export default function StartScreen() {
  const router = useRouter();
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';
  const defaultMaxCards = Number(process.env.NEXT_PUBLIC_CARDS_IN_GAME || 35);
  const defaultCoreValues = Number(process.env.NEXT_PUBLIC_DEFAULT_CORE_VALUES_TO_CHOOSE || 10);
  const [maxCards] = useState<number>(defaultMaxCards);
  const [coreValuesCount, setCoreValuesCount] = useState<number>(defaultCoreValues);
  const [isInitialising, setIsInitialising] = useState(false);
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  const handleViewPreviousResults = () => {
    router.push('/history');
  };

  const handleStart = async () => {
    setIsInitialising(true);
    try {
      const shuffledValues = getRandomValues(valuesData.values);
      const limitedValues = shuffledValues.slice(0, maxCards);

      const session = {
        timestamp: Date.now(),
        targetCoreValues: coreValuesCount,
        currentRound: 1,
        completed: false,
        initialValues: limitedValues,
        remainingValues: limitedValues,
      };

      const sessionId = await addSession(session, initialCategories);

      initializeGameState(sessionId, 1, coreValuesCount, limitedValues, initialCategories);

      router.push(`/exercise?sessionId=${sessionId}`);
    } catch (error) {
      console.error('Error Initialising game:', error);
    } finally {
      setIsInitialising(false);
    }
  };

  const sharedButtonClasses =
    'px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

  return (
    <div aria-labelledby="welcome-heading" className={getContainerClassName(isMobile)}>
      <h1
        id="welcome-heading"
        className={`mb-4 whitespace-nowrap text-center font-extrabold sm:mb-6 ${styles.heading}`}
      >
        Discover Your <span className="text-blue-700">Core Values</span>
      </h1>

      <div
        className={`mx-auto max-w-2xl text-center ${isMobile ? 'mb-4 space-y-2' : 'mb-10 space-y-4 sm:space-y-6'}`}
        aria-label="Introduction"
      >
        <p className={styles.paragraph}>
          Start your journey to clarity and purpose. Some values may surprise you, while others will resonate deeply.
          Find the ones that define you best!
        </p>
        <p className={styles.paragraph}>
          You will start with 35 values and narrow them down to the ones that matter most. Choosing fewer core values,
          like 5 instead of 10, may take a bit longer but will help you focus on what truly defines you.
        </p>
      </div>

      {!isMobile && (
        <div className="mt-6 space-y-4 text-center sm:space-y-6">
          <h2 className="text-lg font-semibold text-black sm:text-xl">Why Discover Your Core Values?</h2>
          <ul className="list-inside list-disc space-y-2 text-left text-sm text-black sm:text-base">
            <li>
              <strong>Clarity in Decision-Making:</strong> Make choices that align with what truly matters to you.
            </li>
            <li>
              <strong>Personal Growth:</strong> Understand your motivations and priorities for deeper self-awareness.
            </li>
            <li>
              <strong>Enhanced Relationships:</strong> Communicate your values clearly and understand others better.
            </li>
            <li>
              <strong>Increased Motivation:</strong> Align your goals with your values for lasting progress.
            </li>
          </ul>
        </div>
      )}

      <form
        id="configuration-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleStart();
        }}
        className={`flex flex-col items-center ${isMobile ? 'gap-3' : 'mt-6 gap-6'}`}
        aria-label="Exercise configuration"
      >
        <label
          id="core-values-count-label"
          htmlFor="core-values-count"
          className={`text-center font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}
        >
          What number of values feels right for defining you?
        </label>
        <input
          id="core-values-count"
          type="number"
          min="1"
          max="10"
          value={coreValuesCount}
          onChange={(e) => setCoreValuesCount(Number(e.target.value))}
          className="w-20 rounded-lg border px-4 py-2 text-center text-black shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          aria-label="Number of core values"
          aria-labelledby="core-values-count-label"
          required
          disabled={isInitialising}
        />
        <button
          type="submit"
          className={`${sharedButtonClasses} ${isInitialising ? 'cursor-not-allowed opacity-50' : ''}`}
          aria-label="Begin discovery of my core values"
          disabled={isInitialising}
        >
          {isInitialising ? 'Initialising...' : 'Start'}
        </button>
      </form>

      <div className={`${isMobile ? 'mt-4' : 'mt-8'} text-center`} aria-label="Previous results navigation">
        <p id="completed-before-description" className="mb-3 text-sm font-semibold text-black sm:text-base">
          Have you completed this before? Revisit your results!
        </p>
        <button
          type="button"
          onClick={handleViewPreviousResults}
          className={`${sharedButtonClasses} ${isInitialising ? 'cursor-not-allowed opacity-50' : ''}`}
          aria-label="View previous results"
          aria-describedby="completed-before-description"
        >
          View Previous Results
        </button>
      </div>
    </div>
  );
}
