import { useMobile } from "@/lib/contexts/MobileContext";
import { SessionListProps } from '../../types';
import { MobileSessionList } from './MobileSessionList';
import { DesktopSessionList } from './DesktopSessionList';
import { useHistoryInit } from '../../hooks/useHistoryInit';

/**
 * Renders a list of sessions, with different layouts for mobile and desktop.
 * Handles initialization and error states.
 *
 * @param {SessionListProps} props - The props for the SessionList component.
 * @param {Array} props.sessions - The list of sessions to display.
 * @param {Function} [props.onSessionDeleted] - Callback function to handle session deletion.
 * @returns {JSX.Element} The rendered component.
 */
/**
 * Renders a list of sessions, displaying either a mobile or desktop version based on the device type.
 * Handles initialization and error states for loading session history.
 *
 * @param {SessionListProps} props - The props for the SessionList component.
 * @param {Array<Session>} props.sessions - The list of sessions to display.
 * @param {Function} [props.onSessionDeleted] - Optional callback function to handle session deletion.
 * @returns {JSX.Element} The rendered SessionList component.
 */
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
