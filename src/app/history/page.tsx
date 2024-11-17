// src/app/history/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { Session } from '@/types';
import { getSessions } from '@/db/indexedDB';
import { SessionList } from '@/components/History/SessionList';

export default function HistoryPage() {
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Session History</h1>
        
        <section 
          aria-label="Value sorting sessions history"
          className="space-y-4"
        >
        {isLoading ? (
          <div 
            role="status" 
            aria-live="polite"
            className="text-center py-4"
          >
            <span className="sr-only">Loading session history...</span>
            Loading...
          </div>
        ) : sessions.length === 0 ? (
          <p 
            role="status" 
            aria-live="polite"
            className="text-gray-600 text-center py-4"
          >
            No sessions found. Complete a value sorting exercise to see your history.
          </p>
        ) : (
          <SessionList 
            sessions={sessions} 
            aria-label="List of completed value sorting sessions"
          />
        )}
      </section>
    </div>
    </div>
  );
}
