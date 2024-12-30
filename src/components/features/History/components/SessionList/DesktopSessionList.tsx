import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostItStyles } from "@/components/features/Cards/components/styles";
import { getCompletedSession, deleteSession, importSession, getRoundsBySession } from "@/lib/db/indexedDB";
import { SessionListProps } from './types';
import { Value, ValueWithReason, Session, CompletedSession, Round } from "@/lib/types";
import { useSessionSelection } from '../../contexts/SessionSelectionContext';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { BlueskyShareButton, LinkedInShareButton, TwitterShareButton } from '@/components/common/ShareButtons';
import { saveAs } from 'file-saver-es';
import { formatDate, handleImportSession, handleExportSession, handleShowValues, handleCopyToClipboard, formatTextForPlatform, generateFullText, generateTitles } from './sessionUtils';

/**
 * Component for displaying a list of sessions in a desktop view.
 * @remarks
 * This component provides functionalities to:
 * - Show values for a selected session.
 * - Replay or resume a session.
 * - Delete selected sessions.
 * - Copy session values to clipboard.
 * - Print session values.
 *
 */
export function DesktopSessionList({ sessions, onSessionDeleted, onSessionImported }: SessionListProps) {
    const router = useRouter(); // Add router
    const [showValuesFor, setShowValuesFor] = useState<string | null>(null);
    const [currentValues, setCurrentValues] = useState<Value[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingCount, setDeletingCount] = useState(0);
    const { postItBaseStyles, tapeEffect } = getPostItStyles(false, false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [reload, setReload] = useState(false);
    const {
        selectedSessions,
        toggleSession,
        selectAll,
        clearSelection,
        isSelected
    } = useSessionSelection();

    // Add navigation handlers
    const handleReplay = (sessionId: string) => {
        router.push(`/replay?sessionId=${sessionId}`);
    };

    const handleResumeGame = (sessionId: string) => {
        router.push(`/exercise?sessionId=${sessionId}`);
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

        const handlePrint = () => {
            const printWindow = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
            if (!printWindow) return;

            const style = document.createElement('style');
            style.textContent = `
                @media print {
                    @page { margin: 2cm; }
                    
                    body { 
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #000;
                        background: #fff;
                    }
    
                    h1 { 
                        font-size: 24pt;
                        color: #1a365d;
                        text-align: center;
                        margin-bottom: 20pt;
                    }
    
                    article {
                        page-break-inside: avoid;
                        border: 1pt solid #e2e8f0;
                        padding: 10pt;
                        margin: 10pt 0;
                        background: #fff;
                        border-radius: 4pt;
                        box-shadow: 2pt 2pt 4pt rgba(0,0,0,0.1);
                    }
    
                    .grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15pt;
                    }
    
                    button { display: none !important; }
                }
            `;

            const content = `
                <html>
                    <head>
                        <title>Core Values</title>
                        ${style.outerHTML}
                    </head>
                    <body>
                        <h1>Selected Core Values</h1>
                        <div class="grid">
                            ${values.map(value => `
                                <article>
                                    <h3 style="font-size: 16pt; margin-bottom: 8pt;">${value.title}</h3>
                                    <p style="margin-bottom: 8pt;">${value.description}</p>
                                    ${value.reason ? `
                                        <div style="border-top: 1pt solid #e2e8f0; padding-top: 8pt; margin-top: 8pt;">
                                            <p style="font-weight: bold;">Why it is meaningful:</p>
                                            <p style="font-style: italic;">${value.reason}</p>
                                        </div>
                                    ` : ''}
                                </article>
                            `).join('')}
                        </div>
                    </body>
                </html>
            `;

            printWindow.document.write(content);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };

        return (
            <section className="space-y-4" aria-labelledby="desktop-values-title">
                <div className="flex justify-between items-center">
                    <h3 id="desktop-values-title" className="text-lg font-bold">Selected Core Values</h3>
                    <span className="text-sm text-black">
                        {values.length} value{values.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex justify-end gap-2 items-center">
                    <button
                        onClick={() => { setCopySuccess(!copySuccess); handleCopyToClipboard(values, setCopySuccess); }}
                        className={`p-0 w-8 h-8 ${copySuccess ? 'bg-green-600' : 'bg-blue-600'} text-white hover:bg-blue-700 transition-colors duration-200 rounded-none flex items-center justify-center`}
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
                    </button>
                    <button
                        onClick={handlePrint}
                        className="p-0  w-8 h-8 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 rounded-none flex items-center justify-center"
                        aria-label="Print values"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M6 2a2 2 0 00-2 2v3h12V4a2 2 0 00-2-2H6zM4 8v6h12V8H4zm2 8v2a2 2 0 002 2h4a2 2 0 002-2v-2H6z" />
                        </svg>
                    </button>
                    <BlueskyShareButton
                        url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://digitalanalogue9.github.io'}
                        text={formatTextForPlatform(values, 'bluesky')}
                        size={22} fill='white'
                    />
                    <TwitterShareButton
                        url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://digitalanalogue9.github.io'}
                        text={formatTextForPlatform(values, 'twitter')}
                        size={20} fill='white'
                    />
                    <LinkedInShareButton
                        url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://digitalanalogue9.github.io'}
                        text={formatTextForPlatform(values, 'linkedin')}
                        size={32} fill='white' />
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
                            <div role="listitem">
                                <h4 className="font-medium">{value.title}</h4>
                                <p className="text-sm text-black mb-2">{value.description}</p>
                                {value.reason && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="text-sm font-medium text-black">Why it is meaningful:</p>
                                        <p className="text-sm text-black italic">{value.reason}</p>
                                    </div>
                                )}
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        );
    };

    useEffect(() => {
        if (reload) {
            onSessionImported?.();
        }
    }, [reload, onSessionImported]);

    return (
        <div className="space-y-4">
            <div className="flex items-center h-8">
                <div className="flex items-center space-x-4">
                    <label
                        htmlFor='select-all-sessions'
                        className="sr-only"
                    >
                        Check to select all sessions
                    </label>
                    <input
                        id='select-all-sessions'
                        type="checkbox"
                        checked={selectedSessions.size === sessions.length && sessions.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-700 focus:ring-blue-600 mt-1"
                    />
                    <span className="text-sm text-black">
                        {selectedSessions.size} selected
                    </span>
                </div>
                <div className="flex justify-end flex-grow space-x-2">
                    {selectedSessions.size > 0 && (
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            aria-label='Delete selected sessions'
                            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                        >
                            Delete Selected
                        </button>
                    )}
                    <label className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                        Import Session
                        <input
                            type="file"
                            accept="application/json"
                            onChange={(event) => handleImportSession(event, setReload, reload)}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            <span className="sr-only">Select</span>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Session ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Last Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Target Values
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Current Round
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sessions.map(session => (
                        <tr key={session.id} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label
                                    htmlFor={`session-${session.id}`}
                                    className="sr-only"
                                >
                                    Check {session.id} to select for deletion
                                </label>
                                <input
                                    id={`session-${session.id}`}
                                    type="checkbox"
                                    checked={isSelected(session.id)}
                                    onChange={() => toggleSession(session.id)}
                                    className="rounded border-gray-300 text-blue-700 focus:ring-blue-600"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-black font-mono">
                                {session.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                <time dateTime={new Date(session.timestamp).toISOString()}>
                                    {formatDate(session.timestamp)}
                                </time>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {session.targetCoreValues}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
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
                                            onClick={() => handleShowValues(session.id, setIsLoading, setCurrentValues, setShowValuesFor)}
                                            aria-label={`Show values for session ${session.id}`}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                                        >
                                            My Values
                                        </button>
                                        {process.env.NODE_ENV === 'development' && (
                                            <button
                                                onClick={() => handleReplay(session.id)}
                                                aria-label={`Replay session ${session.id}`}
                                                className="px-3 py-1.5 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors duration-200"
                                            >
                                                Replay
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleResumeGame(session.id)}
                                        aria-label={`Resume session ${session.id}`}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Resume
                                    </button>
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
                                <button
                                    onClick={() => handleExportSession(session.id, sessions)}
                                    className="px-3 py-1.5 bg-orange-700 text-white rounded-md hover:bg-orange-800 transition-colors duration-200"
                                    aria-label={`Export session ${session.id}`}
                                >
                                    Export
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
