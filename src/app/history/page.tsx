'use client';

import { useEffect, useState } from 'react';
import { Session } from "@/lib/types";
import { getSessions } from "@/lib/db/indexedDB";
import { SessionList } from "@/components/features/History/components/SessionList";
import { SessionSelectionProvider } from '@/components/features/History/contexts/SessionSelectionContext';
import { clearGameState } from "@/lib/utils/storage";
import { useMobile } from "@/lib/contexts/MobileContext";
import { getContainerClassName, getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';

/**
 * The `HistoryPage` component is responsible for displaying the history of sessions.
 * It fetches and displays a list of sessions sorted by timestamp in descending order.
 * 
 * @component
 * 
 * @example
 * ```tsx
 * <HistoryPage />
 * ```
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @remarks
 * - Uses `useEffect` to clear the game state on mount and to load sessions asynchronously.
 * - Displays a loading indicator while sessions are being fetched.
 * - Displays a message if no sessions are found.
 * - Displays a list of sessions if available.
 * 
 * @function
 * 
 * @name HistoryPage
 */
export default function HistoryPage() {
  useEffect(() => {
    clearGameState();
  }, []);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);
  
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await getSessions();
        setSessions(allSessions.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSessions();
  }, []);

  const handleSessionDeleted = (sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
  };

  return (
    <div
      role="main"
      aria-labelledby="history-heading"
      className={getContainerClassName(isMobile)}
    >
      <h1
        id="history-heading"
        className={`${styles.heading} font-extrabold text-center mb-4 sm:mb-6 whitespace-nowrap`}
      >
        Core <span className="text-blue-700">Values</span> Session History
      </h1>

      <section aria-label="Value sorting sessions history" className={styles.spacing}>
        <SessionSelectionProvider>
          {isLoading ? (
            <div role="status" aria-live="polite" className="text-center py-4">
              <span className="sr-only">Loading session history...</span>
              <p className={styles.paragraph}>Loading...</p>
            </div>
          ) : sessions.length === 0 ? (
            <p role="status" aria-live="polite" className={`${styles.paragraph} text-black text-center py-4`}>
              No sessions found. Complete a value sorting exercise to see your history.
            </p>
          ) : (
            <SessionList
              sessions={sessions}
              onSessionDeleted={handleSessionDeleted}
              aria-label="List of completed value sorting sessions"
            />
          )}
        </SessionSelectionProvider>
      </section>
    </div>
  );
}
