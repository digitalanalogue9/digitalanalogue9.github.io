import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompletedSession, deleteSession } from "@/lib/db/indexedDB";
import { SessionListProps } from '../../types';
import { Value, ValueWithReason } from "@/lib/types";
import { useSessionSelection } from '../../contexts/SessionSelectionContext';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { Modal } from '@/components/common/Modal';

/**
 * MobileSessionList component renders a list of sessions with options to view details, select, and delete sessions.
 * 
 * @param {SessionListProps} props - The props for the MobileSessionList component.
 * @param {Session[]} props.sessions - The list of session objects to be displayed.
 * @param {(sessionId: string) => void} [props.onSessionDeleted] - Optional callback function to be called when a session is deleted.
 * 
 * @returns {JSX.Element} The rendered MobileSessionList component.
 * 
 * @component
 * 
 * @example
 * // Example usage of MobileSessionList component
 * <MobileSessionList 
 *   sessions={sessions} 
 *   onSessionDeleted={handleSessionDeleted} 
 * />
 */
export function MobileSessionList({ sessions, onSessionDeleted }: SessionListProps) {
    const [showValuesFor, setShowValuesFor] = useState<string | null>(null);
    const [currentValues, setCurrentValues] = useState<Value[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [deletingCount, setDeletingCount] = useState<number>(0);


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
            setIsSelectionMode(false);
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

    const toggleSelectionMode = () => {
        if (isSelectionMode) {
            clearSelection();
        }
        setIsSelectionMode(!isSelectionMode);
    };

    const renderCompletedValues = (values: ValueWithReason[]) => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center p-4" role="status">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
            );
        }
    
        return (
            <Modal
                isOpen={!!showValuesFor}
                onClose={() => setShowValuesFor(null)}
                title="Core Values"
            >
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <span className="text-sm text-black">
                            {values.length} value{values.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="space-y-4">
                        {values.map(value => (
                            <div key={value.id} className="p-4 bg-yellow-100 rounded shadow">
                                <h4 className="font-medium">{value.title}</h4>
                                <p className="text-sm text-black mb-2">{value.description}</p>
                                {value.reason && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="text-sm font-medium text-black">Why it is meaningful:</p>
                                        <p className="text-sm text-black italic">{value.reason}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowValuesFor(null)}
                        aria-label={`Close`}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        );
    };

    return (
        <>
            <div className="sticky top-0 z-10 bg-white shadow-sm mb-4">
                <div className="flex justify-between items-center p-4">
                    <button
                        onClick={toggleSelectionMode}
                        aria-label={isSelectionMode ? 'Cancel' : 'Select'}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium ${isSelectionMode ? 'bg-gray-200 text-black' : 'bg-gray-100 text-black'
                            }`}
                    >
                        {isSelectionMode ? 'Cancel' : 'Select'}
                    </button>
                    {isSelectionMode && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleSelectAll}
                                aria-label={selectedSessions.size === sessions.length ? 'Deselect all sessions' : 'Select all sessions'}
                                className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-medium"
                            >
                                {selectedSessions.size === sessions.length ? 'Deselect All' : 'Select All'}
                            </button>
                            {selectedSessions.size > 0 && (
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    aria-label={`Delete ${selectedSessions.size} sessions`}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium"
                                >
                                    Delete ({selectedSessions.size})
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {sessions.map(session => (
                    <article
                        key={session.id}
                        className={`bg-white rounded-lg shadow p-4 relative ${isSelectionMode ? 'pl-12' : ''
                            }`}
                    >
                        {isSelectionMode && (
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <input
                                    type="checkbox"
                                    checked={isSelected(session.id)}
                                    onChange={() => toggleSession(session.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                                />
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <time dateTime={new Date(session.timestamp).toISOString()} className="text-sm text-black">
                                    {formatDate(session.timestamp)}
                                </time>
                                <div className="text-sm mt-1">
                                    Target Values: {session.targetCoreValues}
                                </div>
                                <div className="text-sm">
                                    Round: {session.currentRound}
                                </div>
                            </div>
                            <div className={`text-sm ${session.completed ? 'text-green-700' : 'text-blue-700'}`}>
                                {session.completed ? 'Completed' : 'In Progress'}
                            </div>
                        </div>
                        {!isSelectionMode && (
                            <div className="mt-3 flex justify-end space-x-2">
                                {session.completed ? (
                                    <button
                                        onClick={() => handleShowValues(session.id)}
                                        aria-label={`Show values for ${session.id}`}
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                    >
                                        Show Values
                                    </button>
                                ) : (
                                    <Link
                                        href={`/exercise?sessionId=${session.id}`}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        Resume
                                    </Link>
                                )}
                            </div>
                        )}
                    </article>
                ))}
            </div>

            <AnimatePresence>
                {showValuesFor && renderCompletedValues(currentValues)}
            </AnimatePresence>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingCount(0);
                }}
                onConfirm={handleDeleteSelected}
                selectedSessions={selectedSessionObjects}
                isDeleting={isDeleting}
                deletingCount={deletingCount}
            />
        </>
    );
}
