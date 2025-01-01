import { useStore } from '@/lib/store/store';
import { Value, Categories } from '@/lib/types';
import { emptyCategories } from '@/components/features/Categories/constants/categories';
export const initializeGameState = (
  sessionId: string,
  currentRound: number,
  targetCoreValues: number,
  initialCards: Value[],
  initialCategories: Categories = emptyCategories
) => {
  const store = useStore.getState();

  // Session state
  store.setSession({
    sessionId,
    targetCoreValues,
    roundNumber: currentRound, // updated from currentRound
  });

  // Game state
  store.setRemainingCards(initialCards);
  store.setCategories(initialCategories);
  store.setGameStarted(true);
  store.setShowInstructions(true);

  // Commands state
  store.clearCommands();
};
export const clearGameState = () => {
  const store = useStore.getState();

  // Clear all state
  store.setSession({
    sessionId: '',
    targetCoreValues: 10,
    roundNumber: 1, // updated from currentRound
  });
  store.resetGame();
  store.clearCommands();
};
