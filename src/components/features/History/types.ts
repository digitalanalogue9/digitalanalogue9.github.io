import { Session, Value } from "@/lib/types";


export interface SessionListProps {
  sessions: Session[];
  onShowValues?: (sessionId: string) => Promise<Value[]>;
}
