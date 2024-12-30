import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { initDB } from "../../../..//lib/db/indexedDB";
import { useSession } from "./useSession";
import { usePWA } from "../../../..//lib/hooks/usePWA";
import { cacheUtils } from "../../../..//lib/utils/storage";
import { loadSessionState } from "../utils/sessionLoader";
import { useGameState } from './useGameState';

/**
 * Custom hook to initialize the game state.
 *
 * This hook performs the following tasks:
 * - Initializes the database.
 * - Checks for an existing session ID from the URL parameters or the current session.
 * - Loads the session state if a session ID is found.
 * - Checks the offline cache for a session if no session ID is found and the app is offline.
 * - Sets the game as started if a session is successfully loaded.
 * - Handles errors during initialization and sets the loading state accordingly.
 *
 * @returns An object containing:
 * - `isLoading`: A boolean indicating if the initialization is in progress.
 * - `error`: An error object if an error occurred during initialization, otherwise null.
 * - `shouldRedirect`: A boolean indicating if the user should be redirected due to no session being found.
 */
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
