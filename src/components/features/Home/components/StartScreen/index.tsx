'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addSession } from '@/lib/db/indexedDB';
import { initializeGameState } from '@/lib/utils/storage';
import { initialCategories } from '@/components/features/Categories/constants/categories';
import valuesData from '@/data/values.json';
import teamValuesData from '@/data/team-values.json';
import { getRandomValues } from '@/components/features/Home/utils/valuesUtils';
import { useMobile } from '@/lib/contexts/MobileContext';
import { getResponsiveTextStyles, getContainerClassName } from '@/lib/utils/styles/textStyles';
import { ExerciseType } from '@/lib/types/ExerciseType';

export default function StartScreen() {
  const router = useRouter();
  const defaultMaxCards = Number(process.env.NEXT_PUBLIC_CARDS_IN_GAME || 35);
  const defaultCoreValues = Number(process.env.NEXT_PUBLIC_DEFAULT_CORE_VALUES_TO_CHOOSE || 10);
  const [maxCards] = useState<number>(defaultMaxCards);
  const [coreValuesCount, setCoreValuesCount] = useState<number>(defaultCoreValues);
  const [isInitialising, setIsInitialising] = useState(false);
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('personal');

  const handleViewPreviousResults = () => {
    router.push('/history');
  };

  const handleStart = async () => {
    setIsInitialising(true);
    try {
      const sourceData = exerciseType === 'personal' ? valuesData.values : teamValuesData.values;
      const shuffledValues = getRandomValues(sourceData);
      const limitedValues = shuffledValues.slice(0, maxCards);

      const session = {
        timestamp: Date.now(),
        targetCoreValues: coreValuesCount,
        currentRound: 1,
        completed: false,
        initialValues: limitedValues,
        remainingValues: limitedValues,
        exerciseType, // Add this to track session type
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
          Find the ones that define you or your team best!
        </p>
        <p className={styles.paragraph}>
          You will start with 35 values and narrow them down to the ones that matter most. Choosing fewer core values,
          like 5 instead of 10, may take a bit longer but will help you focus on what truly defines you or your team.
        </p>
      </div>
      {/* {!isMobile && (
        <div className="mt-6 space-y-4 text-center sm:space-y-6">
          <h2 className={`${styles.subheading} pb-2 font-bold text-black`}>Why Discover Your Core Values?</h2>
          <p className={styles.paragraph}>
            <strong>Clarity in Decision-Making :</strong> Make choices that align with what truly matters to you or your
            team.
          </p>
          <p className={styles.paragraph}>
            <strong>Personal Growth :</strong> Understand your motivations and priorities or those of your team for deeper self-awareness.
          </p>
          <p className={styles.paragraph}>
            <strong>Enhanced Relationships :</strong> Communicate your values or the values of your team clearly and
            understand others better.
          </p>
          <p className={styles.paragraph}>
            <strong>Increased Motivation :</strong> Align your goals or your team&apos;s goals with your values for lasting progress.
          </p>
        </div>
      )} */}
      <section aria-labelledby="form-heading" className="pt-2">
        <h2 id="form-heading" className={`${styles.subheading} pb-2 text-center font-bold text-black`}>
          Let&apos;s get started!
        </h2>
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
            id="exercise-type-label"
            htmlFor="exercise-type"
            className={`text-center font-semibold ${styles.paragraph}`} // Updated font size
          >
            Do you want to discover your core values or your team&apos;s core values?
          </label>
          <div className="mb-6 flex justify-center" role="radiogroup" aria-labelledby="exercise-type-label">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="exercise-type"
                value="personal"
                checked={exerciseType === 'personal'}
                onChange={() => setExerciseType('personal')}
                className="form-radio"
                aria-checked={exerciseType === 'personal'}
              />
              <span className="ml-2">My own</span>
            </label>
            <label className="ml-4 inline-flex items-center">
              <input
                type="radio"
                name="exercise-type"
                value="team"
                checked={exerciseType === 'team'}
                onChange={() => setExerciseType('team')}
                className="form-radio"
                aria-checked={exerciseType === 'team'}
              />
              <span className="ml-2">The team</span>
            </label>
          </div>
          <label
            id="core-values-count-label"
            htmlFor="core-values-count"
            className={`text-center font-semibold ${styles.paragraph}`} // Updated font size
          >
            What number of values feels right for defining you or your team?
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
            id="start-button"
            className={`${sharedButtonClasses} ${isInitialising ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-label="Begin discovery of my core values"
            disabled={isInitialising}
          >
            {isInitialising ? 'Initialising...' : 'Start'}
          </button>
        </form>
      </section>
      <section aria-labelledby="form-heading" className={`pb-2 pt-4 ${isMobile ? 'gap-3' : 'mt-6 gap-6'}`}>
        <h2 id="form-heading" className={`${styles.subheading} pb-4 text-center font-bold text-black`}>
          Have you completed this before? Revisit your results!
        </h2>
        <div className="flex justify-center">
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
      </section>
    </div>
  );
}
