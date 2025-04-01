import { getSession, getRoundsBySession } from '@/lib/db/indexedDB';
import { initializeGameState } from '@/lib/utils/storage';
import { Value, DropCommandPayload } from '@/lib/types';

export async function loadSessionState(sessionId: string) {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const rounds = await getRoundsBySession(sessionId);
  if (!rounds || rounds.length == 0) {
    throw new Error(`No rounds for session ${session.id}`);
  }
  const currentRound = session.currentRound;

  console.log('Loading session state:', {
    sessionId,
    currentRound,
    roundsCount: rounds.length,
    availableCards: session.remainingValues?.length ?? 0,
  });

  // Get the current round's data
  const currentRoundData = rounds.find((r) => r.roundNumber === currentRound);
  if (!currentRoundData) {
    throw new Error(`Round ${currentRound} not found`);
  }

  // Process drop commands for the current round to get remaining cards
  const remainingValuesMap = new Map<string, Value>((session.remainingValues || []).map((value) => [value.id, value]));

  for (const command of currentRoundData.commands) {
    if (command.type === 'DROP') {
      const dropPayload = command.payload as DropCommandPayload;
      remainingValuesMap.delete(dropPayload.cardId);
    }
  }

  // Convert remaining values back to array
  const remainingValues = Array.from(remainingValuesMap.values());

  console.log('Initializing game state with:', {
    sessionId,
    currentRound,
    targetCoreValues: session.targetCoreValues,
    startingCards: session.remainingValues?.length ?? 0,
    remainingCards: remainingValues,
    categoriesState: Object.entries(currentRoundData.availableCategories).map(([cat, vals]) => ({
      category: cat,
      count: (vals || []).length,
    })),
  });

  // Initialize game state with reconstructed data
  initializeGameState(
    sessionId,
    currentRound,
    session.targetCoreValues,
    remainingValues,
    currentRoundData.availableCategories
  );

  return {
    session,
    currentRound,
  };
}
