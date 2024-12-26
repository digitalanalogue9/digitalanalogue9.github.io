import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompletedSession, deleteSession } from "@/lib/db/indexedDB";
import { SessionListProps } from '../../types';
import { Value, ValueWithReason } from "@/lib/types";
import { useSessionSelection } from '../../contexts/SessionSelectionContext';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { Modal } from '@/components/common/Modal';
import BlueskyShareButton from '@/components/common/BlueskyShareButton';
import { LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton } from 'next-share';

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
    const [copySuccess, setCopySuccess] = useState(false);


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

    const formatValueForClipboard = (value: ValueWithReason): string => {
        return `Title: ${value.title}\nDescription: ${value.description}${value.reason ? `\nWhy: ${value.reason}` : ''}\n\n`;
    };

    const handleCopyToClipboard = (values: ValueWithReason[]) => {
        const formattedText = `My Core Values\n--------------\n\n`
            + values.map(formatValueForClipboard).join('') + `\n\nCreated with https://digitalanalogue9.github.io`;

        navigator.clipboard.writeText(formattedText)
            .then(() => {
                // You might want to add a toast notification here
                console.log('Copied to clipboard');
                setCopySuccess(true);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                setCopySuccess(false);
            });
    };
    const generateFullText = (values: ValueWithReason[]): string => {
        return values.map(value => `${value.title}${value.description ? ` - ${value.description}` : ''}`).join(', ');
    };

    const generateTitles = (values: ValueWithReason[]): string => {
        return values.map(value => value.title).join(', ');
    };

    const formatTextForPlatform = (values: ValueWithReason[], platform: 'bluesky' | 'twitter' | 'linkedin'): string => {
        const baseText = `My Core Values: `;
        const link = ` https://digitalanalogue9.github.io`;
        const maxLength = platform === 'bluesky' ? 300 : platform === 'twitter' ? 144 : Infinity;

        const fullText = baseText + generateFullText(values) + link;
        const titlesText = baseText + generateTitles(values) + link;

        if (fullText.length <= maxLength) {
            return fullText;
        }
        else if (titlesText.length <= maxLength) {
            return titlesText;
        }
        else {
            return titlesText.substring(0, maxLength - 3) + '...';
        }

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
                onClose={() => { setCopySuccess(false); setShowValuesFor(null) }}
                title=""
            >
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => { setCopySuccess(false); setShowValuesFor(null); }}
                        aria-label={`Close`}
                        className="p-2 bg-white text-black  rounded-none hover:bg-white transition-colors duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M10 9.293l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <h3 className="mb-2 text-lg font-medium leading-6 text-black" id="fake-modal-title">Share your Core Values</h3>
                <div className="flex gap-2 justify-center items-center mb-4">
                    <button
                        onClick={() => { setCopySuccess(!copySuccess); handleCopyToClipboard(values); }}
                        className="mt-0.5 p-0 w-8 h-8 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-none flex items-center justify-center"
                        aria-label="Copy values to clipboard"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M8 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-1h1a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a2 2 0 00-2-2H8zm0 2h4v1H8V4zm-3 3h10v9H5V7zm2 2a1 1 0 000 2h6a1 1 0 100-2H7z" />
                        </svg>
                        {copySuccess && (
                            <span aria-hidden="true" className="text-white ml-2">
                                ✓
                            </span>
                        )}
                    </button>
                    <BlueskyShareButton
                        text={formatTextForPlatform(currentValues, 'bluesky')}
                        size={22}
                        fill={'white'} />
                    <TwitterShareButton
                        url="https://digitalanalogue9.github.io"
                        title={formatTextForPlatform(currentValues, 'twitter')}
                    >
                        <TwitterIcon size={32} />
                    </TwitterShareButton>
                    <LinkedinShareButton
                        url="https://digitalanalogue9.github.io"
                        title="Check out Core Values!"
                        summary={formatTextForPlatform(currentValues, 'linkedin')}
                    >
                        <LinkedinIcon size={32} />
                    </LinkedinShareButton>
                </div>

                <div className="space-y-4">
                    {/* <div className="flex justify-end">
                        <span className="text-sm text-black">
                            {values.length} value{values.length !== 1 ? 's' : ''}
                        </span>
                    </div> */}
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
                        onClick={() => { setCopySuccess(false); setShowValuesFor(null); }}
                        aria-label={`Close`}
                        className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
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
                        className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                    >
                        {isSelectionMode ? 'Cancel' : 'Select'}
                    </button>
                    {isSelectionMode && (
                        <div className="flex items-center space-x-2">
                            {selectedSessions.size > 0 && (
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    aria-label={`Delete ${selectedSessions.size} sessions`}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                                >
                                    Delete ({selectedSessions.size})
                                </button>
                            )}
                            <button
                                onClick={handleSelectAll}
                                aria-label={selectedSessions.size === sessions.length ? 'Deselect all sessions' : 'Select all sessions'}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                {selectedSessions.size === sessions.length ? 'Select None' : 'Select All'}
                            </button>
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
                                <label
                                    id={`label-select-${session.id}`}
                                    htmlFor={`select-${session.id}`}
                                    className="sr-only"
                                >
                                    Show instructions when starting the exercise
                                </label>
                                <input
                                    id={`select-${session.id}`}
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
                                        onClick={() => { setCopySuccess(false); handleShowValues(session.id) }}
                                        aria-label={`Show values for ${session.id}`}
                                        className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                                    >
                                        Show Values
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = `/exercise?sessionId=${session.id}`}
                                        aria-label="Resume session"
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Resume
                                    </button>
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
