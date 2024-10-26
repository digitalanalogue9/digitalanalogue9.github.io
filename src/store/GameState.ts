'use client';
import { Categories } from "@/types/Categories";
import { Value } from "@/types/Value";

export interface GameState {
  targetCoreValues: number;
  currentRound: number;
  remainingCards: Value[];
  categories: Categories;
  sessionId: string;
  setTargetCoreValues: (count: number) => void;
  setCurrentRound: (round: number) => void;
  setRemainingCards: (cards: Value[]) => void;
  setCategories: (categories: Categories) => void;
  setSessionId: (id: string) => void;
}
