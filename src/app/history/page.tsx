'use client'

import { useEffect, useState } from 'react';
import { Session } from '@/types/Session';
import { Round } from '@/types/Round';
import { getSessions, getRoundsBySession } from '@/db/indexedDB';
import Link from 'next/link';
import { Categories } from '@/types/Categories';
import { CategoryName } from '@/types/CategoryName';
import { Command } from '@/types/Command';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      const allSessions = await getSessions();
      setSessions(allSessions.sort((a, b) => b.timestamp - a.timestamp));
    };

    loadSessions();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Session History</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Values
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Round
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <>
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {session.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(session.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.targetCoreValues}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.currentRound}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setExpandedSession(
                        expandedSession === session.id ? null : session.id
                      )}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      {expandedSession === session.id ? 'Hide Details' : 'Show Details'}
                    </button>
                    <Link
                      href={`/replay?sessionId=${session.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Replay
                    </Link>
                  </td>
                </tr>
                {expandedSession === session.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      <SessionDetails sessionId={session.id} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SessionDetails({ sessionId }: { sessionId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundStates, setRoundStates] = useState<Map<number, Categories>>(new Map());

  const calculateRoundStates = (rounds: Round[]) => {
    const states = new Map<number, Categories>();
    
    rounds.forEach(round => {
      const categories: Categories = {
        'Very Important': [],
        'Quite Important': [],
        'Important': [],
        'Of Some Importance': [],
        'Not Important': []
      };

      // Replay commands to build final state
      round.commands.forEach(command => {
        // Implement command replay logic here to build categories state
      });

      states.set(round.roundNumber, categories);
    });

    setRoundStates(states);
  };

  useEffect(() => {
    const loadRounds = async () => {
      const roundData = await getRoundsBySession(sessionId);
      setRounds(roundData);
      calculateRoundStates(roundData);
    };

    loadRounds();
  }, [sessionId]); // Only sessionId as dependency since calculateRoundStates is defined in component scope

  return (
    <div className="space-y-4">
      {rounds.map((round) => (
        <div key={round.roundNumber} className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Round {round.roundNumber}</h3>
          <div className="space-y-2">
            <h4 className="font-medium">Commands:</h4>
            <ul className="text-sm text-gray-600">
              {round.commands.map((command, index) => (
                <li key={index}>
                  {/* Display command details */}
                  Command {index + 1}: {JSON.stringify(command)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
