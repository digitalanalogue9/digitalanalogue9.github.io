import { useMobile } from '@/lib/contexts/MobileContext';
import { SessionListProps } from './types';
import { MobileSessionList } from './MobileSessionList';
import { DesktopSessionList } from './DesktopSessionList';
import { useHistoryInit } from '../../hooks/useHistoryInit';

/**
 * Renders a list of sessions, with different layouts for mobile and desktop.
 * Handles initialization and error states.
 */
export function SessionList({ sessions, onSessionDeleted, onSessionImported }: SessionListProps) {
  const { isMobile } = useMobile();
  const { isInitialized, error } = useHistoryInit();

  if (error) {
    return <div className="p-4 text-center text-red-600">Error loading session history. Please try again later.</div>;
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  return isMobile ? (
    <MobileSessionList sessions={sessions} onSessionDeleted={onSessionDeleted} onSessionImported={onSessionImported} />
  ) : (
    <DesktopSessionList sessions={sessions} onSessionDeleted={onSessionDeleted} onSessionImported={onSessionImported} />
  );
}
