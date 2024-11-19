// src/components/History/SessionList.tsx
import { useState, useEffect } from 'react';
import { Session, Value, CompletedSession, ValueWithReason } from "@/lib/types";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostItStyles } from "@/components/features/Cards/components/styles";
import { getCompletedSession } from "@/lib/db/indexedDB";
import { useMobile } from "@/lib/contexts/MobileContext"; // Use the MobileContext instead
import { SessionListProps} from '@/components/features/History/types';

export function SessionList({
  sessions
}: SessionListProps) {
  const [showValuesFor, setShowValuesFor] = useState<string | null>(null);
  const [currentValues, setCurrentValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isMobile
  } = useMobile(); // Use the mobile context
  const {
    postItBaseStyles,
    tapeEffect
  } = getPostItStyles(false, false);
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  const handleShowValues = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const completedSession = await getCompletedSession(sessionId);
      if (completedSession?.finalValues) {
        setCurrentValues(completedSession.finalValues);
        setShowValuesFor(sessionId);
      }
    } catch (error) {
      console.error('Error loading values:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderCompletedValues = (values: ValueWithReason[]) => {
    if (isLoading) {
      return <div className="flex items-center justify-center p-4" role="status" aria-label="Loading values">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" aria-hidden="true" />
          <span className="sr-only">Loading values...</span>
        </div>;
    }
    if (isMobile) {
      return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="mobile-values-title">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full max-h-[80vh] overflow-y-auto" role="document">
            <div className="flex justify-between items-center mb-4">
              <h3 id="mobile-values-title" className="text-lg font-bold">
                Core Values
              </h3>
              <span className="text-sm text-gray-500" aria-label={`Total values: ${values.length}`}>
                {values.length} value{values.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-4" role="list" aria-label="Selected core values">
              {values.map(value => <div key={value.id} className="p-4 bg-yellow-50 rounded shadow" role="listitem">
                  <h4 className="font-medium">{value.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{value.description}</p>
                  {value.reason && <div className="mt-2 pt-2 border-t border-gray-200" aria-label={`Reasoning for ${value.title}`}>
                      <p className="text-sm font-medium text-gray-700">Why it is meaningful:</p>
                      <p className="text-sm text-gray-600 italic">
                        {value.reason || "No reason given"}
                      </p>
                    </div>}
                </div>)}
            </div>
            <button onClick={() => setShowValuesFor(null)} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Close values view">
              Close
            </button>
          </div>
        </div>;
    }
    return <section className="space-y-4" aria-labelledby="desktop-values-title">
        <div className="flex justify-between items-center">
          <h3 id="desktop-values-title" className="text-lg font-bold">
            Selected Core Values
          </h3>
          <span className="text-sm text-gray-500" aria-label={`Total values: ${values.length}`}>
            {values.length} value{values.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4" role="list" aria-label="Core values grid">
          {values.map(value => <motion.article key={value.id} className={`${postItBaseStyles} ${tapeEffect} p-4`} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} role="listitem">
              <h4 className="font-medium">{value.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{value.description}</p>
              {value.reason && <div className="mt-2 pt-2 border-t border-gray-200" aria-label={`Reasoning for ${value.title}`}>
                  <p className="text-sm font-medium text-gray-700">Why it is meaningful:</p>
                  <p className="text-sm text-gray-600 italic">
                    {value.reason || "No reason given"}
                  </p>
                </div>}
            </motion.article>)}
        </div>
      </section>;
  };
  if (isMobile) {
    return <div className="space-y-4" role="list" aria-label="Session history">
        {sessions.map(session => <article key={session.id} className="bg-white rounded-lg shadow p-4" role="listitem">
            <div className="flex justify-between items-start mb-2">
              <div>
                <time dateTime={new Date(session.timestamp).toISOString()} className="text-sm text-gray-500">
                  {formatDate(session.timestamp)}
                </time>
                <div className="text-sm mt-1">
                  Target Values: {session.targetCoreValues}
                </div>
                <div className="text-sm">
                  Round: {session.currentRound}
                </div>
              </div>
              <div className={`text-sm ${session.completed ? 'text-green-600' : 'text-blue-600'}`} role="status">
                {session.completed ? 'Completed' : 'In Progress'}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              {session.completed ? <button onClick={() => handleShowValues(session.id)} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" aria-label={`Show values for session from ${formatDate(session.timestamp)}`}>
                  Show Values
                </button> : <Link href={`/?sessionId=${session.id}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label={`Resume session from ${formatDate(session.timestamp)}`}>
                  Resume Game
                </Link>}
            </div>
          </article>)}
        <AnimatePresence>
          {showValuesFor && renderCompletedValues(currentValues)}
        </AnimatePresence>
      </div>;
  }
  return <div className="space-y-4">
      <table className="min-w-full bg-white shadow-md rounded-lg" role="table" aria-label="Session history">
        <thead>
          <tr className="bg-gray-50 border-b" role="row">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Session ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target Values
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Round
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sessions.map(session => <tr key={session.id} className="hover:bg-gray-50" role="row">
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono" role="cell">
                {session.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                <time dateTime={new Date(session.timestamp).toISOString()}>
                  {formatDate(session.timestamp)}
                </time>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                {session.targetCoreValues}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" role="cell">
                {session.currentRound}
              </td>
              <td className="px-6 py-4 whitespace-nowrap" role="cell">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${session.completed ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`} role="status">
                  {session.completed ? 'Completed' : 'In Progress'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2" role="cell">
                {session.completed ? <>
                    <button onClick={() => handleShowValues(session.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" aria-label={`Show values for session from ${formatDate(session.timestamp)}`}>
                      Show Values
                    </button>
                    {process.env.NODE_ENV === 'development' && <Link href={`/replay?sessionId=${session.id}`} className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label={`Replay session from ${formatDate(session.timestamp)}`}>
                        Replay
                      </Link>}
                  </> : <Link href={`/?sessionId=${session.id}`} className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label={`Resume session from ${formatDate(session.timestamp)}`}>
                    Resume Game
                  </Link>}
              </td>
            </tr>)}
        </tbody>
      </table>
      <AnimatePresence>
        {showValuesFor && <div className="bg-white shadow-md rounded-lg p-6" role="region" aria-label="Selected values details">
            {renderCompletedValues(currentValues)}
          </div>}
      </AnimatePresence>
    </div>;
}