import { useState, useEffect } from 'react';
import { Session, Value, CompletedSession, ValueWithReason } from '@/types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostItStyles } from '@/components/Card/styles';
import { getCompletedSession } from '@/db/indexedDB';

interface SessionListProps {
  sessions: Session[];
  onShowValues?: (sessionId: string) => Promise<Value[]>; // Make it optional since we'll use getCompletedSession directly
}

export function SessionList({ sessions }: SessionListProps) {
  const [showValuesFor, setShowValuesFor] = useState<string | null>(null);
  const [currentValues, setCurrentValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { postItBaseStyles, tapeEffect } = getPostItStyles(false, false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Update the handleShowValues function
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
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }


    if (isMobile) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Core Values</h3>
              <span className="text-sm text-gray-500">
                {values.length} value{values.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-4">
              {values.map((value) => (
                <div key={value.id} className="p-4 bg-yellow-50 rounded shadow">
                  <h4 className="font-medium">{value.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{value.description}</p>
                  {value.reason ? (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Why it is meaningful:</p>
                      <p className="text-sm text-gray-600 italic">
                        {value.reason || "No reason given"}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowValuesFor(null)}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Selected Core Values</h3>
          <span className="text-sm text-gray-500">
            {values.length} value{values.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {values.map((value) => (
            <motion.div
              key={value.id}
              className={`${postItBaseStyles} ${tapeEffect} p-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h4 className="font-medium">{value.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{value.description}</p>
              {value.reason ? (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Why it is meaningful:</p>
                  <p className="text-sm text-gray-600 italic">
                    {value.reason || "No reason given"}
                  </p>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Mobile List View
  if (isMobile) {
    return (
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm text-gray-500">
                  {formatDate(session.timestamp)}
                </div>
                <div className="text-sm mt-1">
                  Target Values: {session.targetCoreValues}
                </div>
                <div className="text-sm">
                  Round: {session.currentRound}
                </div>
              </div>
              <div className={`text-sm ${session.completed ? 'text-green-600' : 'text-blue-600'}`}>
                {session.completed ? 'Completed' : 'In Progress'}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              {session.completed ? (
                <button
                  onClick={() => handleShowValues(session.id)}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  Show Values
                </button>
              ) : (
                <Link
                  href={`/?sessionId=${session.id}`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  Resume Game
                </Link>
              )}
            </div>
          </div>
        ))}
        <AnimatePresence>
          {showValuesFor && renderCompletedValues(currentValues)}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="space-y-4">
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
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sessions.map((session) => (
            <tr key={session.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
    ${session.completed
                    ? 'bg-green-50 text-green-700'
                    : 'bg-blue-50 text-blue-700'}`}
                >
                  {session.completed ? 'Completed' : 'In Progress'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {session.completed ? (
                  <>
                    <button
                      onClick={() => handleShowValues(session.id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Show Values
                    </button>
                    {process.env.NODE_ENV === 'development' && (<Link
                      href={`/replay?sessionId=${session.id}`}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Replay
                    </Link>)}
                  </>
                ) : (
                  <Link
                    href={`/?sessionId=${session.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Resume Game
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AnimatePresence>
        {showValuesFor && (
          <div className="bg-white shadow-md rounded-lg p-6">
            {renderCompletedValues(currentValues)}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
