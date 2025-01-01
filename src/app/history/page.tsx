'use client';

import { useEffect, useState } from 'react';
import { Session } from '@/lib/types';
import { getSessions } from '@/lib/db/indexedDB';
import { SessionList } from '@/components/features/History/components/SessionList';
import { SessionSelectionProvider } from '@/components/features/History/contexts/SessionSelectionContext';
import { clearGameState } from '@/lib/utils/storage';
import { useMobile } from '@/lib/contexts/MobileContext';
import { getContainerClassName, getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';

/**
 * The `HistoryPage` component is responsible for displaying the history of sessions.
 * It fetches and displays a list of sessions sorted by timestamp in descending order.
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
    document.title = 'Core Values - History';
  }, []);

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
    setSessions((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
  };

  const handleSessionImported = async () => {
    setIsLoading(true);
    try {
      const allSessions = await getSessions();
      setSessions(allSessions.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div aria-labelledby="history-heading" className={getContainerClassName(isMobile)}>
      <div className="text-center">
        <h1 id="history-heading" className={`${styles.heading} mb-4 whitespace-nowrap font-extrabold sm:mb-6`}>
          Core <span className="text-blue-700">Values</span> Session History
        </h1>
      </div>
      <section aria-label="Value sorting sessions history" className={styles.spacing}>
        <SessionSelectionProvider>
          {isLoading ? (
            <div role="status" aria-live="polite" className="py-4 text-center">
              <span className="sr-only">Loading session history...</span>
              <p className={styles.paragraph}>Loading...</p>
            </div>
          ) : sessions.length === 0 ? (
            <p role="status" aria-live="polite" className={`${styles.paragraph} py-4 text-center text-black`}>
              No sessions found. Complete a value sorting exercise to see your history.
            </p>
          ) : (
            <SessionList
              sessions={sessions}
              onSessionDeleted={handleSessionDeleted}
              onSessionImported={handleSessionImported}
              aria-label="List of completed value sorting sessions"
            />
          )}
        </SessionSelectionProvider>
      </section>
    </div>
  );
}
