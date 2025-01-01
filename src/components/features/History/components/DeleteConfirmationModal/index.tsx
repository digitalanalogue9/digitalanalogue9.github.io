import { Modal } from '@/components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { DeleteConfirmationModalProps } from './types';

/**
 * DeleteConfirmationModal component renders a modal dialog to confirm the deletion of sessions.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onConfirm - Function to call when the deletion is confirmed.
 * @param {Array} props.selectedSessions - Array of selected sessions to be deleted.
 * @param {boolean} props.isDeleting - Indicates whether the deletion process is ongoing.
 * @param {number} [props.deletingCount] - Optional count of sessions being deleted.
 *
 * @returns {JSX.Element} The rendered DeleteConfirmationModal component.
 */
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedSessions,
  isDeleting,
  deletingCount,
}: DeleteConfirmationModalProps) {
  const sessionCount = isDeleting && typeof deletingCount === 'number' ? deletingCount : selectedSessions.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${sessionCount === 1 ? 'Session' : `${sessionCount} Sessions`}`}
    >
      <div className="space-y-4">
        {!isDeleting ? (
          <p className="text-sm text-black">
            {sessionCount === 1
              ? 'Are you sure you want to delete this session? This action cannot be undone.'
              : `Are you sure you want to delete these ${sessionCount} sessions? This action cannot be undone.`}
          </p>
        ) : (
          <motion.p
            key="deleting-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-black"
          >
            {deletingCount > 0
              ? `Deleting ${deletingCount} session${deletingCount !== 1 ? 's' : ''}...`
              : 'Finishing up...'}
          </motion.p>
        )}

        {!isDeleting && sessionCount > 0 && (
          <div className="mt-4 max-h-48 overflow-y-auto rounded-md bg-gray-100 p-4">
            <ul className="space-y-2">
              {selectedSessions.map((session) => (
                <li key={session.id} className="text-sm text-black">
                  <span className="font-medium">{new Date(session.timestamp).toLocaleDateString()}</span>
                  {session.completed ? ' (Completed)' : ' (In Progress)'} - Round {session.currentRound}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-100 sm:ml-3 sm:w-auto sm:text-sm"
            aria-label="Confirm delete"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <motion.span key="button-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isDeleting ? 'Deleting...' : `Delete ${sessionCount > 1 ? `(${sessionCount})` : ''}`}
            </motion.span>
          </button>
          <button
            type="button"
            aria-label="Cancel deletion of sessions"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-100 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
