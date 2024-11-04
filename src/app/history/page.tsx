'use client'

import { useEffect, useState } from 'react';
import { Session } from '@/types';
import { getSessions } from '@/db/indexedDB';
import { SessionList } from '@/components/History/SessionList';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const allSessions = await getSessions();
      setSessions(allSessions.sort((a, b) => b.timestamp - a.timestamp));
    };

    loadSessions();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Session History</h1>
      <SessionList sessions={sessions} />
    </div>
  );
}
