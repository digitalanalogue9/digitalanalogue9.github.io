export interface SessionSelectionContextType {
  selectedSessions: Set<string>;
  toggleSession: (sessionId: string) => void;
  selectAll: (sessionIds: string[]) => void;
  clearSelection: () => void;
  isSelected: (sessionId: string) => boolean;
}
