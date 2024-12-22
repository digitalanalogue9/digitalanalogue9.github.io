'use client';

import { useEffect, useState } from 'react';
import { Session } from "@/lib/types";
import { getSessions } from "@/lib/db/indexedDB";
import { SessionList } from "@/components/features/History/components/SessionList";
import { SessionSelectionProvider } from '@/components/features/History/contexts/SessionSelectionContext';
import { clearGameState } from "@/lib/utils/storage";
export default function HistoryPage() {
  useEffect(() => {
    clearGameState();
  }, []);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Session History</h1>
        
        <section aria-label="Value sorting sessions history" className="space-y-4">
          <SessionSelectionProvider>
            {isLoading ? (
              <div role="status" aria-live="polite" className="text-center py-4">
                <span className="sr-only">Loading session history...</span>
                Loading...
              </div>
            ) : sessions.length === 0 ? (
              <p role="status" aria-live="polite" className="text-black text-center py-4">
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
    </div>
  );
}
  