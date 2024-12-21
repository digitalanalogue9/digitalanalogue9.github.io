import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { initDB } from "@/lib/db/indexedDB";
import { useSession } from "./useSession";
import { usePWA } from "@/lib/hooks/usePWA";
import { cacheUtils } from "@/lib/utils/storage";
import { loadSessionState } from "../utils/sessionLoader";
import { useGameState } from './useGameState';

export function useGameInit() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const searchParams = useSearchParams();
  const { sessionId } = useSession();
  const { isOffline } = usePWA();
  const { setGameStarted } = useGameState();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();

        // Check for existing session or URL param session
        const urlSessionId = searchParams?.get('sessionId');
        const activeSessionId = sessionId || urlSessionId;

        if (activeSessionId) {
          await loadSessionState(activeSessionId);
          setGameStarted(true);
          return;
        }

        // No session found, check offline cache
        if (isOffline) {
          const cachedSession = await cacheUtils.getCachedData<{
            sessionId: string;
          }>('currentSession');

          if (!cachedSession) {
            throw new Error('No session found');
          }
        } else {
          throw new Error('No session found');
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to initialize game'));
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isOffline, sessionId, searchParams, setGameStarted]);

  return {
    isLoading,
    error,
    shouldRedirect: error?.message === 'No session found'
  };
}
