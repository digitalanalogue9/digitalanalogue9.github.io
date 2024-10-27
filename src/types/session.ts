import { Round } from './Round';
export interface Session {
    id: string;
    timestamp: number;
    targetCoreValues: number;
    currentRound: number;
}

