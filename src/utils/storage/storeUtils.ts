import { useStore } from '@/store/store'
import { Value, Categories } from '@/types';
import { emptyCategories } from '@/constants/categories';

export const initializeGameState = (
  sessionId: string,
  targetCoreValues: number,
  initialCards: Value[],
  initialCategories: Categories = emptyCategories
) => {
  const store = useStore.getState();
  
  // Session state
  store.setSession({
    sessionId,
    targetCoreValues,
    roundNumber: 1  // updated from currentRound
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
    roundNumber: 1  // updated from currentRound
  });
  store.resetGame();
  store.clearCommands();
};
