// src/types/Session.ts
import { Categories } from './Categories';
import { Value } from './Value';

export interface Session {
  id: string;
  timestamp: number;
  targetCoreValues: number;
  currentRound: number;
  completed: boolean;
  initialValues: Value[];
}

export interface ReconstructedState {
  categories: Categories;
  currentRound: number;
  remainingCards: Value[];
}