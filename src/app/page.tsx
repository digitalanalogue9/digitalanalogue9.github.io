'use client'

import { useEffect, useState } from 'react';
import StartScreen from '../components/StartScreen';
import RoundUI from '../components/Round/RoundUI';
import Instructions from '../components/Instructions';
import { initDB } from '../db/indexedDB';
import valuesData from '../data/values.json';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePWA } from '../hooks/usePWA';
import PWAPrompt from '@/components/PWAPrompt';
import { cacheUtils } from '@/utils/storage';
import { useSession } from '@/hooks/useSession';
import { useGameState } from '@/hooks/useGameState';

export default function Home() {
  const { sessionId } = useSession();
  const { 
    isGameStarted, 
    showInstructions, 
    setGameStarted, 
    setShowInstructions 
  } = useGameState();
  const { isOffline } = usePWA();

  useEffect(() => {
    const initialize = async () => {
      await initDB();
      
      if (!sessionId && isOffline) {
        try {
          const cachedSession = await cacheUtils.getCachedData<{
            sessionId: string;
            values: typeof valuesData.values;
          }>('currentSession');

          if (cachedSession) {
            setGameStarted(true);
          }
        } catch (error) {
          console.error('Error loading cached data:', error);
        }
      }
    };

    initialize();
  }, [isOffline, sessionId, setGameStarted]);
  
  const handleGameStart = () => {
    setGameStarted(true);
    setShowInstructions(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        {!isGameStarted ? (
          <StartScreen onStart={handleGameStart} />
        ) : (
          <RoundUI />
        )}
        {showInstructions && (
          <Instructions onClose={() => setShowInstructions(false)} />
        )}
        <PWAPrompt />
      </div>
    </DndProvider>
  );
}
