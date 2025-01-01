'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoundUIDebug from '@/components/features/Exercise/components/RoundUIDebug';
import RoundUI from '@/components/features/Exercise/components/RoundUI';
import Instructions from '@/components/features/Exercise/components/Instructions';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PWAPrompt from '@/components/common/PWAPrompt';
import { useGameState } from '@/components/features/Exercise/hooks/useGameState';
import { forceReload } from '@/lib/utils/cache';
import { useGameInit } from '@/components/features/Exercise/hooks/useGameInit';
import { useMobile } from '@/lib/contexts/MobileContext';

function ExerciseContent() {
  const router = useRouter();
  const { showInstructions, setShowInstructions } = useGameState();
  const { isLoading, error, shouldRedirect } = useGameInit();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.title = 'Core Values - Exercise';
  }, []);

  useEffect(() => {
    const lastVersion = localStorage.getItem('app-version');
    const currentVersion = process.env.NEXT_PUBLIC_VERSION ?? '0.0.0';
    if (lastVersion !== currentVersion) {
      localStorage.setItem('app-version', currentVersion);
      forceReload();
    }
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/');
    }
  }, [shouldRedirect, router]);

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status" aria-live="polite">
        <span className="sr-only">Loading exercise...</span>
        Loading...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status" aria-live="polite">
        <span className="sr-only">Loading exercise...</span>
        Loading...
      </div>
    );
  }

  if (error && !shouldRedirect) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-600" role="alert">
        An error occurred while loading the exercise. Please try again.
      </div>
    );
  }

  // Use RoundUIDebug in development, RoundUI in production
  const GameComponent = process.env.NODE_ENV === 'development' ? RoundUIDebug : RoundUI;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-1 flex-col" aria-label="Core Values Exercise">
        <GameComponent />
        {showInstructions && (
          <Instructions
            onClose={() => setShowInstructions(false)}
            onStart={() => {}}
            aria-label="Exercise Instructions"
          />
        )}

        <PWAPrompt />
      </div>
    </DndProvider>
  );
}

export default function ExercisePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <span className="sr-only">Loading exercise...</span>
          Loading...
        </div>
      }
    >
      <ExerciseContent />
    </Suspense>
  );
}
