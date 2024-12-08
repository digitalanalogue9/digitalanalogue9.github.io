import { useMobile } from "@/lib/contexts/MobileContext";
import { SessionListProps } from '../../types';
import { MobileSessionList } from './MobileSessionList';
import { DesktopSessionList } from './DesktopSessionList';
import { useHistoryInit } from '../../hooks/useHistoryInit';

export function SessionList({ sessions, onSessionDeleted = () => {} }: SessionListProps) {
  const { isMobile } = useMobile();
  const { isInitialized, error } = useHistoryInit();

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        Error loading session history. Please try again later.
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }
  
  return isMobile ? 
    <MobileSessionList sessions={sessions} onSessionDeleted={onSessionDeleted} /> : 
    <DesktopSessionList sessions={sessions} onSessionDeleted={onSessionDeleted} />;
}
