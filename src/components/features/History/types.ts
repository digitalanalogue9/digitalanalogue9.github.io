import { Session, Value } from "@/lib/types";


export interface SessionListProps {
  sessions: Session[];
  onShowValues?: (sessionId: string) => Promise<Value[]>;
  onSessionDeleted?: (sessionId: string) => void;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedSessions: Session[];
  isDeleting: boolean;
  deletingCount: number;
}