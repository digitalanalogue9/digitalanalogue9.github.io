// src/types/Session.ts
import { Categories } from './Categories';
import { ExerciseType } from './ExerciseType';
import { Value } from './Value';

export interface Session {
  id: string;
  timestamp: number;
  targetCoreValues: number;
  currentRound: number;
  completed: boolean;
  initialValues: Value[];
  remainingValues: Value[];
  exerciseType: ExerciseType;
}

export interface ReconstructedState {
  categories: Categories;
  currentRound: number;
  remainingCards: Value[];
}
