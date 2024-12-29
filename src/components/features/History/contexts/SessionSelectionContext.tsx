import { createContext, useContext, useState, useCallback } from 'react';
import { SessionSelectionContextType } from './types';


const SessionSelectionContext = createContext<SessionSelectionContextType | undefined>(undefined);

export function SessionSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());

  const toggleSession = useCallback((sessionId: string) => {
    setSelectedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((sessionIds: string[]) => {
    setSelectedSessions(new Set(sessionIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSessions(new Set());
  }, []);

  const isSelected = useCallback((sessionId: string) => {
    return selectedSessions.has(sessionId);
  }, [selectedSessions]);

  return (
    <SessionSelectionContext.Provider 
      value={{ 
        selectedSessions, 
        toggleSession, 
        selectAll, 
        clearSelection, 
        isSelected 
      }}
    >
      {children}
    </SessionSelectionContext.Provider>
  );
}

export function useSessionSelection() {
  const context = useContext(SessionSelectionContext);
  if (context === undefined) {
    throw new Error('useSessionSelection must be used within a SessionSelectionProvider');
  }
  return context;
}
