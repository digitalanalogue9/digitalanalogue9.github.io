// src/types/Session.ts
import { Round } from './Round';

export interface Session {
  id: string;
  timestamp: number;
  targetCoreValues: number;
  currentRound: number;
  completed: boolean;
}
