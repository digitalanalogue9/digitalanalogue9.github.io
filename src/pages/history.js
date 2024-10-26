import { useEffect, useState } from 'react';
import { getSessions } from '../db/indexedDB';

export default function History() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      const loadedSessions = await getSessions();
      setSessions(loadedSessions);
    };
    loadSessions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Previous Sessions</h1>
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="border p-4 rounded">
            <h2 className="font-bold">{session.id}</h2>
            <p>Date: {new Date(session.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}