// src/components/StartScreen.tsx
'use client';

import { useState } from 'react';
import { StartScreenProps } from './types';
import { getEnvNumber, getEnvBoolean } from "@/lib/utils/config";
import Link from 'next/link';
import { addSession } from "@/lib/db/indexedDB";
import { initializeGameState } from "@/lib/utils/storage";
import valuesData from '@/data/values.json';
import { getRandomValues } from "../../utils";
export default function StartScreen({
  onStart
}: StartScreenProps) {
  const isDebug = getEnvBoolean('debug', false);
  const maxCards = getEnvNumber('maxCards', 35);
  const defaultCoreValues = getEnvNumber('numCoreValues', 5);
  const [coreValuesCount, setCoreValuesCount] = useState<number>(defaultCoreValues);
  const handleStart = async () => {
    const session = {
      timestamp: Date.now(),
      targetCoreValues: coreValuesCount,
      currentRound: 1,
      completed: false
    };
    const sessionId = await addSession(session);
    const shuffledValues = getRandomValues(valuesData.values);
    const limitedValues = shuffledValues.slice(0, maxCards);
    initializeGameState(sessionId, coreValuesCount, limitedValues, {
      'Very Important': [],
      'Quite Important': [],
      'Important': [],
      'Of Some Importance': [],
      'Not Important': []
    });
    onStart();
  };
  return <div className="h-[calc(100vh-4rem)] overflow-y-auto" // Changed this line
  role="main" aria-labelledby="welcome-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 id="welcome-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 sm:mb-6">
          <span className="text-gray-900">Discover Your </span>
          <span className="text-blue-600">Core Values</span>
        </h1>

        <div className="max-w-2xl mx-auto text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8" aria-label="Introduction">
          <p className="text-base sm:text-lg text-gray-700">
            Welcome to the Core Values discovery exercise! Through this interactive experience,
            you will discover and prioritise your personal core values, helping you identify what matters most to you.
          </p>
        </div>

        {isDebug && <div className="mb-4 text-xs sm:text-sm text-gray-600 text-center" role="note" aria-label="Debug information">
            <div>Debug Mode: On</div>
            <div>Max Cards: {maxCards}</div>
            <div>Default Core Values: {defaultCoreValues}</div>
          </div>}

        <form onSubmit={e => {
        e.preventDefault();
        handleStart();
      }} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6" aria-label="Exercise configuration">
          <label htmlFor="core-values-count" className="text-base sm:text-lg font-medium text-center sm:text-left whitespace-normal sm:whitespace-nowrap">
            How many core values do you want to end up with?
          </label>
          <div className="flex gap-3 sm:gap-4 items-center">
            <input id="core-values-count" type="number" min="1" max="10" value={coreValuesCount} onChange={e => setCoreValuesCount(Number(e.target.value))} className="border rounded p-2 w-16 sm:w-20 text-center shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" aria-label="Number of core values" required />
            <button type="submit" className="px-4 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Begin the core values exercise">
              Start Exercise
            </button>
          </div>
        </form>

        <div className="mt-6 sm:mt-8 text-center" aria-label="Previous results navigation">
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            Have you completed this exercise before?
          </p>
          <Link href="/history" className="text-blue-600 hover:text-blue-800 underline font-medium text-sm sm:text-base inline-flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1" aria-label="View your previous exercise results">
            <span>View Your Previous Results</span>
            <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>;
}