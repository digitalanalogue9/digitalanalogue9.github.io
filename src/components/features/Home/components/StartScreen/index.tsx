'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEnvNumber, getEnvBoolean } from "@/lib/utils/config";
import { addSession } from "@/lib/db/indexedDB";
import { initializeGameState } from "@/lib/utils/storage";
import { initialCategories } from "@/components/features/Categories/constants/categories";
import valuesData from '@/data/values.json';
import { getRandomValues } from '@/components/features/Home/utils/valuesUtils';

export default function StartScreen() {
  const router = useRouter();
  const isDebug = getEnvBoolean('debug', false);
  const maxCards = getEnvNumber('maxCards', 35);
  const defaultCoreValues = getEnvNumber('numCoreValues', 5);
  const [coreValuesCount, setCoreValuesCount] = useState<number>(defaultCoreValues);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resizing
    window.addEventListener('resize', checkMobile);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${isMobile ? 'flex flex-col justify-center py-2' : 'py-8'
        }`}
    >
      {/* Header */}
      <h1
        id="welcome-heading"
        className={`${isMobile ? 'text-2xl' : 'text-4xl sm:text-5xl'
          } font-extrabold text-center mb-4 sm:mb-6 whitespace-nowrap`}
      >
        Discover Your <span className="text-blue-700">Core Values</span>
      </h1>

      {/* Introduction */}
      <div
        className={`max-w-2xl mx-auto text-center ${isMobile ? 'space-y-2 mb-4' : 'space-y-4 sm:space-y-6 mb-10'
          }`}
        aria-label="Introduction"
      >
        <p className={`${isMobile ? 'text-sm' : 'text-lg sm:text-xl'} text-black font-medium`}>
          Your core values define who you are and guide your decisions. Uncover what truly drives you with this interactive tool.
        </p>
        <p className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} text-black`}>
          You will start with 35 values and refine them to focus on the ones that truly resonate with your core values.
        </p>
      </div>

      {/* Desktop-specific Benefits */}
      {!isMobile && (
        <div className="mt-6 text-center space-y-4 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Why Discover Your Core Values?
          </h2>
          <ul className="list-disc list-inside text-black text-sm sm:text-base space-y-2">
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
          className={`text-center ${isMobile ? 'text-sm' : 'text-base font-medium'}`}
        >
          Choose the number of values that define you:
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
        <p className="text-black mb-3 text-sm sm:text-base">
          Have you completed this before? Revisit your results!
        </p>
        <button
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
