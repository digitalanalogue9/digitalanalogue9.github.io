'use client';

import { useState, useEffect } from 'react';
import { Session } from "@/types/Session.1";
import { getSessions } from '@/utils/sessionUtils';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const loadedSessions = await getSessions();
      setSessions(loadedSessions);
    };
    loadSessions();
  }, []);

  return (
    <div>
      <h1>History</h1>
      {sessions.map((session) => (
        <div key={session.id}>
          <h2>Session {session.id}</h2>
          <p>Date: {new Date(session.timestamp).toLocaleString()}</p>
          {/* Add more session details as needed */}
        </div>
      ))}
    </div>
  );
}
