import { Session } from "../../../../../lib/types";

/** Props for the modal that confirms deletion of selected sessions */
export interface DeleteConfirmationModalProps {
    /** Controls visibility of the modal */
    isOpen: boolean;
    /** Callback to close the modal */
    onClose: () => void;
    /** Callback when deletion is confirmed */
    onConfirm: () => void;
    /** Array of sessions selected for deletion */
    selectedSessions: Session[];
    /** Flag indicating if deletion is in progress */
    isDeleting: boolean;
    /** Number of sessions currently being deleted */
    deletingCount: number;
  }