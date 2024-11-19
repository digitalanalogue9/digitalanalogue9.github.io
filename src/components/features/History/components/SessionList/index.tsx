import { useMobile } from "@/lib/contexts/MobileContext";
import { SessionListProps } from '../../types';
import { MobileSessionList } from './MobileSessionList';
import { DesktopSessionList } from './DesktopSessionList';

export function SessionList({ sessions, onSessionDeleted = () => {} }: SessionListProps) {
  const { isMobile } = useMobile();
  
  return isMobile ? 
    <MobileSessionList sessions={sessions} onSessionDeleted={onSessionDeleted} /> : 
    <DesktopSessionList sessions={sessions} onSessionDeleted={onSessionDeleted} />;
}
