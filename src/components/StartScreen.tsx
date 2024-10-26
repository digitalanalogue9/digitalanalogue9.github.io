'use client'

import { useState } from 'react';
import useGameStore from '../store/useGameStore';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [coreValuesCount, setCoreValuesCount] = useState<number>(5);
  const setTargetCoreValues = useGameStore(state => state.setTargetCoreValues);

  const handleStart = () => {
    setTargetCoreValues(coreValuesCount);
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Core Values</h1>
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium whitespace-nowrap">
          How many core values do you want to end up with?
        </label>
        <input
          type="number"
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
