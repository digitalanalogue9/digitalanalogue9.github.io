import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostItStyles } from "@/components/features/Cards/components/styles";
import { getCompletedSession, deleteSession } from "@/lib/db/indexedDB";
import { SessionListProps } from '../../types';
import { Value, ValueWithReason } from "@/lib/types";
import { useSessionSelection } from '../../contexts/SessionSelectionContext';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

export function DesktopSessionList({ sessions, onSessionDeleted }: SessionListProps) {
    const [showValuesFor, setShowValuesFor] = useState<string | null>(null);
    const [currentValues, setCurrentValues] = useState<Value[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingCount, setDeletingCount] = useState(0);
    const { postItBaseStyles, tapeEffect } = getPostItStyles(false, false);
    const {
        selectedSessions,
        toggleSession,
        selectAll,
        clearSelection,
        isSelected
    } = useSessionSelection();

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


    const handleDeleteSelected = async () => {
        setIsDeleting(true);
        const selectedCount = selectedSessions.size;
        setDeletingCount(selectedCount);

        try {
            const selectedIds = Array.from(selectedSessions);
            for (let i = 0; i < selectedIds.length; i++) {
                const sessionId = selectedIds[i];
                await deleteSession(sessionId);
                onSessionDeleted?.(sessionId);
                setDeletingCount(selectedCount - (i + 1));
                // Add a small delay to make the count animation visible
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // After all deletions, wait a moment before cleaning up
            await new Promise(resolve => setTimeout(resolve, 300));
            clearSelection();
        } catch (error) {
            console.error('Error deleting sessions:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setDeletingCount(0);
        }
    };

    const handleSelectAll = () => {
        const sessionIds = sessions.map(session => session.id);
        if (selectedSessions.size === sessions.length) {
            clearSelection();
        } else {
            selectAll(sessionIds);
        }
    };

    const selectedSessionObjects = sessions.filter(session =>
        isSelected(session.id)
    );

    const renderCompletedValues = (values: ValueWithReason[]) => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center p-4" role="status">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            );
        }

        return (
            <section className="space-y-4" aria-labelledby="desktop-values-title">
                <div className="flex justify-between items-center">
                    <h3 id="desktop-values-title" className="text-lg font-bold">Selected Core Values</h3>
                    <span className="text-sm text-gray-500">
                        {values.length} value{values.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-4" role="list">
                    {values.map(value => (
                        <motion.article
                            key={value.id}
                            className={`${postItBaseStyles} ${tapeEffect} p-4`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h4 className="font-medium">{value.title}</h4>
                            <p className="text-sm text-gray-700 mb-2">{value.description}</p>
                            {value.reason && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">Why it is meaningful:</p>
                                    <p className="text-sm text-gray-700 italic">{value.reason}</p>
                                </div>
                            )}
                        </motion.article>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    <input
                        type="checkbox"
                        checked={selectedSessions.size === sessions.length && sessions.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                        {selectedSessions.size} selected
                    </span>
                </div>
                {selectedSessions.size > 0 && (
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                        Delete Selected
                    </button>
                )}
            </div>

            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span className="sr-only">Select</span>
                        </th>
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
                    {sessions.map(session => (
                        <tr key={session.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    checked={isSelected(session.id)}
                                    onChange={() => toggleSession(session.id)}
                                    className="rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                {session.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <time dateTime={new Date(session.timestamp).toISOString()}>
                                    {formatDate(session.timestamp)}
                                </time>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {session.targetCoreValues}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {session.currentRound}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${session.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
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
                                        {process.env.NODE_ENV === 'development' && (
                                            <Link
                                                href={`/replay?sessionId=${session.id}`}
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                Replay
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={`/?sessionId=${session.id}`}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Resume Game
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        selectAll([session.id]);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                                    aria-label={`Delete session from ${formatDate(session.timestamp)}`}
                                >
                                    Delete
                                </button>
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

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingCount(selectedSessions.size);
                }}
                onConfirm={handleDeleteSelected}
                selectedSessions={selectedSessionObjects}
                isDeleting={isDeleting}
                deletingCount={selectedSessions.size}
            />
        </div>
    );

}
