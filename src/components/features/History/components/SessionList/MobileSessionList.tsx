import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getCompletedSession, deleteSession } from '@/lib/db/indexedDB';
import { SessionListProps } from './types';
import { Value, ValueWithReason } from '@/lib/types';
import { useSessionSelection } from '../../contexts/SessionSelectionContext';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { Modal } from '@/components/common/Modal';
import { BlueskyShareButton, LinkedInShareButton, TwitterShareButton } from '@/components/common/ShareButtons';
import { formatRelative } from 'date-fns';

import { handleImportSession, handleExportSession, handleCopyToClipboard, formatTextForPlatform } from './sessionUtils';

/**
 * MobileSessionList component renders a list of sessions with options to view details, select, and delete sessions.
 */
export function MobileSessionList({ sessions, onSessionDeleted, onSessionImported }: SessionListProps) {
  const [showValuesFor, setShowValuesFor] = useState<string | null>(null);
  const [currentValues, setCurrentValues] = useState<Value[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [deletingCount, setDeletingCount] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [reload, setReload] = useState(false);

  const { selectedSessions, toggleSession, selectAll, clearSelection, isSelected } = useSessionSelection();

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
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // After all deletions, wait a moment before cleaning up
      await new Promise((resolve) => setTimeout(resolve, 300));
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
    const sessionIds = sessions.map((session) => session.id);
    if (selectedSessions.size === sessions.length) {
      clearSelection();
    } else {
      selectAll(sessionIds);
    }
  };

  const selectedSessionObjects = sessions.filter((session) => isSelected(session.id));

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
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
      );
    }

    return (
      <Modal
        isOpen={!!showValuesFor}
        onClose={() => {
          setCopySuccess(false);
          setShowValuesFor(null);
        }}
        title=""
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setCopySuccess(false);
              setShowValuesFor(null);
            }}
            aria-label={`Close`}
            className="rounded-none bg-white p-2 text-black transition-colors duration-200 hover:bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 9.293l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <h3 className="mb-2 text-lg font-medium leading-6 text-black" id="fake-modal-title">
          Share your Core Values
        </h3>
        <div className="mb-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCopySuccess(!copySuccess);
              handleCopyToClipboard(values, setCopySuccess);
            }}
            className={`h-8 w-8 p-0 ${copySuccess ? 'bg-green-600' : 'bg-blue-600'} flex items-center justify-center rounded-none text-white transition-colors duration-200 hover:bg-blue-700`}
            aria-label="Copy values to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-1h1a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a2 2 0 00-2-2H8zm0 2h4v1H8V4zm-3 3h10v9H5V7zm2 2a1 1 0 000 2h6a1 1 0 100-2H7z" />
            </svg>
          </button>
          <BlueskyShareButton
            url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
            text={formatTextForPlatform(currentValues, 'bluesky')}
            size={22}
            fill="white"
          />
          <TwitterShareButton
            url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
            text={formatTextForPlatform(currentValues, 'twitter')}
            size={22}
            fill="white"
          />
          <LinkedInShareButton
            url={process.env.NEXT_PUBLIC_SERVER_URL || 'https://core-values.me'}
            text={formatTextForPlatform(currentValues, 'linkedin')}
            size={32}
            fill="white"
          />
        </div>

        <div className="space-y-4">
          {/* <div className="flex justify-end">
                        <span className="text-sm text-black">
                            {values.length} value{values.length !== 1 ? 's' : ''}
                        </span>
                    </div> */}
          <div className="space-y-4">
            {values.map((value) => (
              <div key={value.id} className="rounded bg-yellow-100 p-4 shadow">
                <h4 className="font-medium">{value.title}</h4>
                <p className="mb-2 text-sm text-black">{value.description}</p>
                {value.reason && (
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <p className="text-sm font-medium text-black">Why it is meaningful:</p>
                    <p className="text-sm italic text-black">{value.reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setCopySuccess(false);
              setShowValuesFor(null);
            }}
            aria-label={`Close`}
            className="w-full rounded-md bg-blue-600 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    if (reload) {
      onSessionImported?.();
    }
  }, [reload, onSessionImported]);

  return (
    <>
      <div className="sticky top-0 z-10 mb-4 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            onClick={toggleSelectionMode}
            aria-label={isSelectionMode ? 'Cancel' : 'Select'}
            className="rounded-md bg-gray-600 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-gray-700"
          >
            {isSelectionMode ? 'Cancel' : 'Select'}
          </button>
          {isSelectionMode && (
            <div className="flex items-center space-x-2">
              {selectedSessions.size > 0 && (
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  aria-label={`Delete ${selectedSessions.size} sessions`}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-red-700"
                >
                  Delete ({selectedSessions.size})
                </button>
              )}
              <button
                type="button"
                onClick={handleSelectAll}
                aria-label={selectedSessions.size === sessions.length ? 'Deselect all sessions' : 'Select all sessions'}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-blue-700"
              >
                {selectedSessions.size === sessions.length ? 'Select None' : 'Select All'}
              </button>
            </div>
          )}
          <label className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-blue-700">
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

      <div className="space-y-4">
        {sessions.map((session) => (
          <article
            key={session.id}
            className={`relative rounded-lg bg-white p-4 shadow ${isSelectionMode ? 'pl-12' : ''}`}
          >
            {isSelectionMode && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <label id={`label-select-${session.id}`} htmlFor={`select-${session.id}`} className="sr-only">
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
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="mt-1 text-sm">Type : {session.exerciseType}</div> {/* Added line */}
                <time dateTime={new Date(session.timestamp).toISOString()} className="mt-1 text-sm text-black">
                  Last updated : {formatRelative(new Date(session.timestamp).toISOString(), new Date())}
                </time>
                <div className="mt-1 text-sm">Target values : {session.targetCoreValues}</div>
                <div className="mt-1 text-sm">Round : {session.currentRound}</div>
              </div>
              <div className={`text-sm ${session.completed ? 'text-green-700' : 'text-blue-700'}`}>
                {session.completed ? 'Completed' : 'In Progress'}
              </div>
            </div>
            {!isSelectionMode && (
              <div className="mt-3 flex justify-end space-x-2">
                {session.completed ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setCopySuccess(false);
                        handleShowValues(session.id);
                      }}
                      aria-label={`Show values for ${session.id}`}
                      className="rounded-md bg-green-700 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-green-800"
                    >
                      Show Values
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportSession(session.id, sessions)}
                      className="rounded-md bg-orange-700 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-orange-800"
                      aria-label={`Export session ${session.id}`}
                    >
                      Export
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => (window.location.href = `/exercise?sessionId=${session.id}&resume=true`)}
                    aria-label="Resume session"
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-white transition-colors duration-200 hover:bg-blue-700"
                  >
                    Resume
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <AnimatePresence>{showValuesFor && renderCompletedValues(currentValues)}</AnimatePresence>

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
