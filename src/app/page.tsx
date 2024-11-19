// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import RoundUIDebug from "@/components/features/Round/RoundUIDebug";
import StartScreen from "@/components/features/Game/components/StartScreen";
import RoundUI from "@/components/features/Round/RoundUI";
import Instructions from "@/components/common/Instructions";
import { initDB } from "@/lib/db/indexedDB";
import valuesData from "@/data/values.json";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePWA } from "@/lib/hooks/usePWA";
import PWAPrompt from "@/components/common/PWAPrompt";
import { cacheUtils } from "@/lib/utils/storage";
import { useSession } from "@/components/features/Game/hooks/useSession";
import { useGameState } from "@/components/features/Game/hooks/useGameState";
import { clearGameState } from "@/lib/utils/storage";
import { forceReload } from "@/lib/utils/cache";
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    sessionId
  } = useSession();
  const {
    isGameStarted,
    showInstructions,
    setGameStarted,
    setShowInstructions
  } = useGameState();
  const {
    isOffline
  } = usePWA();
  useEffect(() => {
    const lastVersion = localStorage.getItem('app-version');
    const currentVersion = process.env.NEXT_PUBLIC_VERSION ?? '0.0.0';
    if (lastVersion !== currentVersion) {
      localStorage.setItem('app-version', currentVersion);
      forceReload();
    }
  }, []);
  useEffect(() => {
    if (!window.location.search.includes('sessionId')) {
      clearGameState();
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        if (!sessionId && isOffline) {
          const cachedSession = await cacheUtils.getCachedData<{
            sessionId: string;
            values: typeof valuesData.values;
          }>('currentSession');
          if (cachedSession) {
            setGameStarted(true);
          }
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, [isOffline, sessionId, setGameStarted]);
  const handleGameStart = () => {
    setGameStarted(true);
    setShowInstructions(true);
  };
  if (isLoading) {
    return <div className="flex items-center justify-center flex-1" role="status" aria-live="polite">
        <span className="sr-only">Loading application...</span>
        Loading...
      </div>;
  }

  // Use RoundUIDebug in development, RoundUI in production
  const GameComponent = process.env.NODE_ENV === 'development' ? RoundUIDebug : RoundUI;
  return <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex flex-col" aria-label="Core Values Application">
        <h1 className="sr-only">Core Values - Personal Value Discovery Tool</h1>
        
        {!isGameStarted ? <StartScreen onStart={handleGameStart} /> : <GameComponent />}
        
        {showInstructions && <Instructions onClose={() => setShowInstructions(false)} onStart={handleGameStart} aria-label="Game Instructions" />}
        
        <PWAPrompt />
      </div>
    </DndProvider>;
}