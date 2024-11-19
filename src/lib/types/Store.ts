// src/lib/types/Store.ts
import { Categories, Value, Command, Round } from './index';

export interface StoreState {
  sessionId: string;
  roundNumber: number;
  targetCoreValues: number;
  remainingCards: Value[];
  categories: Categories;
  isGameStarted: boolean;
  showInstructions: boolean;
  commands: Command[];
  currentRound: Round | null;
  currentRoundCommands: Command[];
  
  setSession: (session: {
    sessionId: string;
    targetCoreValues: number;
    roundNumber: number;
  }) => void;
  setSessionId: (id: string) => void;
  setRoundNumber: (round: number) => void;
  setTargetCoreValues: (count: number) => void;
  clearSession: () => void;
  setRemainingCards: (cards: Value[]) => void;
  setCategories: (categories: Categories) => void;
  setGameStarted: (started: boolean) => void;
  setShowInstructions: (show: boolean) => void;
  resetGame: () => void;
  addCommand: (command: Command) => Promise<void>;
  clearCommands: () => void;
}
