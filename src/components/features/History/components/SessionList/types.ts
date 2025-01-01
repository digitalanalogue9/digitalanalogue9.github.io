import { Session, Value } from '@/lib/types';

/** Props for the list component that displays previous exercise sessions */
export interface SessionListProps {
  /** Array of past exercise sessions */
  sessions: Session[];
  /** Callback to load values for a specific session */
  onShowValues?: (sessionId: string) => Promise<Value[]>;
  /** Callback triggered when a session is deleted */
  onSessionDeleted: (sessionId: string) => void;
  /** Callback triggered when a session is imported */
  onSessionImported: () => void;
}
