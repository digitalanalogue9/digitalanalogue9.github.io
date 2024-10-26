'use client'

import { useState, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import RoundUI from '../components/RoundUI';
import Instructions from '../components/Instructions';
import useGameStore from '../store/useGameStore';
import { generateSessionName } from '../utils/sessionUtils';
import { initDB } from '../db/indexedDB';
import valuesData from '../data/values.json';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { setSessionId, setRemainingCards } = useGameStore();

  useEffect(() => {
    // Initialize IndexedDB when the app loads
    initDB();
  }, []);

  const handleStart = () => {
    const sessionId = generateSessionName();
    setSessionId(sessionId);
    setRemainingCards(valuesData.values);
    setGameStarted(true);
    setShowInstructions(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {!gameStarted ? (
          <StartScreen onStart={handleStart} />
        ) : (
          <RoundUI />
        )}
        {showInstructions && (
          <Instructions onClose={() => setShowInstructions(false)} />
        )}
      </div>
    </DndProvider>
  );
}
