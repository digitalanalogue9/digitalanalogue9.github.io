'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEnvNumber, getEnvBoolean } from "@/lib/utils/config";
import { addSession } from "@/lib/db/indexedDB";
import { initializeGameState } from "@/lib/utils/storage";
import { initialCategories } from "@/components/features/Categories/constants/categories";
import valuesData from '@/data/values.json';
import { getRandomValues } from '@/components/features/Home/utils/valuesUtils';
import { useMobile } from '@/lib/contexts/MobileContext';
import { getResponsiveTextStyles, getContainerClassName } from "@/lib/utils/styles/textStyles";

/**
 * The `StartScreen` component is the entry point for users to begin discovering their core values.
 * It provides an interface for users to configure the number of core values they want to identify
 * and start the exercise. The component also adapts its layout based on the screen size (mobile or desktop).
 *
 * @component
 * @example
 * ```tsx
 * <StartScreen />
 * ```
 *
 * @returns {JSX.Element} The rendered StartScreen component.
 *
 * @remarks
 * - The component uses the `useRouter` hook from Next.js for navigation.
 * - It initializes the game state and navigates to the exercise screen upon starting.
 * - The number of core values can be configured between 1 and 10.
 * - The component adapts its layout for mobile and desktop views.
 *
 * @function
 * @name StartScreen
 */
export default function StartScreen() {
  const router = useRouter();
  const isDebug = getEnvBoolean('DEBUG', false);
  const maxCards = getEnvNumber('CARDS_IN_GAME', 35);
  const defaultCoreValues = getEnvNumber('DEFAULT_CORE_VALUES_TO_CHOOSE', 10);
  const [coreValuesCount, setCoreValuesCount] = useState<number>(defaultCoreValues);
  const [isInitializing, setIsInitializing] = useState(false);
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  const handleViewPreviousResults = () => {
    router.push('/history');
  };

  const handleStart = async () => {
    setIsInitializing(true);
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
      console.error('Error initializing game:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const sharedButtonClasses =
    "px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  return (
    <div
      role="main"
      aria-labelledby="welcome-heading"
      className={getContainerClassName(isMobile)}
    >
      {/* Header */}
      <h1
        id="welcome-heading"
        className={`font-extrabold text-center mb-4 sm:mb-6 whitespace-nowrap ${styles.heading}`}
      >
        Discover Your <span className="text-blue-700">Core Values</span>
      </h1>

      {/* Introduction */}
      <div
        className={`max-w-2xl mx-auto text-center ${
          isMobile ? 'space-y-2 mb-4' : 'space-y-4 sm:space-y-6 mb-10'
        }`}
        aria-label="Introduction"
      >
         <p className={styles.paragraph}>
          Start your journey to clarity and purpose. Some values may surprise you, while others will resonate deeply. Find the ones that define you best!
        </p>
        <p className={styles.paragraph}>
          You will start with 35 values and narrow them down to the ones that matter most. Choosing fewer core values, like 5 instead of 10, may take a bit longer but will help you focus on what truly defines you.
        </p>
      </div>

      {/* Desktop-specific Benefits */}
      {!isMobile && (
        <div className="mt-6 text-center space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Why Discover Your Core Values?
          </h2>
          <ul className="list-disc list-inside text-black text-sm sm:text-base space-y-2 text-left">
            <li><strong>Clarity in Decision-Making:</strong> Make choices that align with what truly matters to you.</li>
            <li><strong>Personal Growth:</strong> Understand your motivations and priorities for deeper self-awareness.</li>
            <li><strong>Enhanced Relationships:</strong> Communicate your values clearly and understand others better.</li>
            <li><strong>Increased Motivation:</strong> Align your goals with your values for lasting progress.</li>
          </ul>
        </div>
      )}

      {/* Configuration Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStart();
        }}
        className={`flex flex-col items-center ${isMobile ? 'gap-3' : 'gap-6 mt-6'}`}
        aria-label="Exercise configuration"
      >
        <label
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
          className="border rounded-lg px-4 py-2 w-20 text-center shadow-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Number of core values"
          required
          disabled={isInitializing}
        />
        <button
          type="submit"
          className={`${sharedButtonClasses} ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Begin discovery of my core values"
          disabled={isInitializing}
        >
          {isInitializing ? 'Initializing...' : 'Start'}
        </button>
      </form>

      {/* Previous Results Navigation */}
      <div
        className={`${isMobile ? 'mt-4' : 'mt-8'} text-center`}
        aria-label="Previous results navigation"
      >
        <p className="text-black mb-3 text-sm sm:text-base font-semibold">
          Have you completed this before? Revisit your results!
        </p>
        <button
          type="button"
          onClick={handleViewPreviousResults}
          className={`${sharedButtonClasses} ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="View previous results"
        >
          View Previous Results
        </button>
      </div>
    </div>
  );
}
