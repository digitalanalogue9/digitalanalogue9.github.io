'use client'

import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { StartScreenProps } from './StartScreenProps';
import { getEnvNumber, getEnvBoolean } from '@/utils/envUtils';

export default function StartScreen({ onStart }: StartScreenProps) {
  const isDebug = getEnvBoolean('debug', false);
  const maxCards = getEnvNumber('maxCards', 5);
  const defaultCoreValues = getEnvNumber('numCoreValues', 5);
  const [coreValuesCount, setCoreValuesCount] = useState<number>(defaultCoreValues);
  const setTargetCoreValues = useGameStore((state) => state.setTargetCoreValues);
  const initializeGame = useGameStore((state) => state.initializeGame);

  const handleStart = () => {
    setTargetCoreValues(coreValuesCount);
    initializeGame();
    onStart();
  };
 
  return (
    <div suppressHydrationWarning={true} className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Core Values</h1>
      {isDebug && (
        <div className="mb-4 text-sm text-gray-600">
          <div>Debug Mode: On</div>
          <div>Max Cards: {maxCards}</div>
          <div>Default Core Values: {defaultCoreValues}</div>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium whitespace-nowrap">
          How many core values do you want to end up with?
        </label>
        <input
          type="number"
          title="Maximum core values"
          min="1"
          max="10"
          value={coreValuesCount}
          onChange={(e) => setCoreValuesCount(Number(e.target.value))}
          className="border rounded p-2 w-20"
        />
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
        >
          Start
        </button>
      </div>
    </div>
  );
}
