import { useState } from 'react';
import useGameStore from '../store/useGameStore';

export default function StartScreen({ onStart }) {
  const [coreValuesCount, setCoreValuesCount] = useState(5);
  const setTargetCoreValues = useGameStore(state => state.setTargetCoreValues);

  const handleStart = () => {
    setTargetCoreValues(coreValuesCount);
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Core Values</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          How many core values do you want to end up with?
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={coreValuesCount}
          onChange={(e) => setCoreValuesCount(Number(e.target.value))}
          className="border rounded p-2"
        />
      </div>
      <button
        onClick={handleStart}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Start
      </button>
    </div>
  );
}