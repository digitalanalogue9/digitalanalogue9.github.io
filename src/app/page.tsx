'use client'

import { useEffect, useState } from 'react';
import RoundUIDebug from '@/components/Round/RoundUIDebug';
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
import { clearGameState } from '@/utils/storage';

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
    // Clear game state when mounting the page component
    // unless there's a sessionId in the URL
    if (!window.location.search.includes('sessionId')) {
      clearGameState();
    }
  }, []);

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

  // Use RoundUIDebug in development, RoundUI in production
const GameComponent = process.env.NODE_ENV === 'development' ? RoundUIDebug : RoundUI;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        {!isGameStarted ? (
          <StartScreen onStart={handleGameStart} />
        ) : (
          <GameComponent />
        )}
        {showInstructions && (
          <Instructions onClose={() => setShowInstructions(false)} />
        )}
        <PWAPrompt />
      </div>
    </DndProvider>
  );
}
