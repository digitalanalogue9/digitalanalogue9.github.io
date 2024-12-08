import { getSession, getRoundsBySession } from "@/lib/db/indexedDB";
import { initializeGameState } from "@/lib/utils/storage";
import { Round, Value, Categories, DropCommandPayload, MoveCommandPayload } from "@/lib/types";
import valuesData from '@/data/values.json';

export async function loadSessionState(sessionId: string) {
  // Get the session and its rounds
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const rounds = await getRoundsBySession(sessionId);
  const currentRound = session.currentRound;

  // Initialize categories
  let categories: Categories = {
    'Very Important': [],
    'Quite Important': [],
    'Important': [],
    'Of Some Importance': [],
    'Not Important': []
  };

  // Create a map of all possible values
  const allValues = new Map<string, Value>(valuesData.values.map(value => [value.id, value]));

  // Reconstruct categories from commands
  for (const round of rounds) {
    for (const command of round.commands) {
      if (command.type === 'DROP') {
        const dropPayload = command.payload as DropCommandPayload;
        const value = allValues.get(dropPayload.cardId);
        if (value && dropPayload.category in categories) {
          categories[dropPayload.category] = [...(categories[dropPayload.category] ?? []), value];
        }
      } else if (command.type === 'MOVE') {
        const movePayload = command.payload as MoveCommandPayload;
        const value = allValues.get(movePayload.cardId);
        if (value && movePayload.fromCategory in categories && movePayload.toCategory in categories) {
          // Remove from source
          const sourceCategory = categories[movePayload.fromCategory] ?? [];
          categories[movePayload.fromCategory] = sourceCategory.filter(v => v.id !== movePayload.cardId);

          // Add to target
          const targetCategory = categories[movePayload.toCategory] ?? [];
          categories[movePayload.toCategory] = [...targetCategory, value];
        }
      }
    }
  }

  // Calculate remaining cards
  const usedCardIds = new Set(Object.values(categories).flatMap(cards => cards?.map(card => card.id) ?? []));
  const remainingCards = session.initialValues.filter(value => !usedCardIds.has(value.id));

  // Initialize game state with reconstructed data
  initializeGameState(
    sessionId,
    session.targetCoreValues,
    remainingCards,
    categories
  );

  return {
    session,
    currentRound: rounds.find(r => r.roundNumber === currentRound)
  };
}
