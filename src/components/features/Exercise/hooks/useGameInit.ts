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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sessionId } = useSession();
  const { isOffline } = usePWA();
  const { setGameStarted } = useGameState();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        
        // If we already have a sessionId, just set game as started
        if (sessionId) {
          setGameStarted(true);
          return;
        }

        // Only check URL params if we don't have a session
        const urlSessionId = searchParams?.get('sessionId');
        if (urlSessionId) {
          await loadSessionState(urlSessionId);
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
