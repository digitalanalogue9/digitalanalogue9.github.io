import { getSession, getRoundsBySession } from "@/lib/db/indexedDB";
import { initializeGameState } from "@/lib/utils/storage";
import { Round, Value, Categories } from "@/lib/types";

export async function loadSessionState(sessionId: string) {
  // Get the session and its rounds
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const rounds = await getRoundsBySession(sessionId);
  const currentRound = session.currentRound;

  // Find the current round's data
  const currentRoundData = rounds.find(r => r.roundNumber === currentRound);
  
  if (currentRoundData) {
    // If we have round data, calculate remaining cards
    const categorizedCards = Object.values(currentRoundData.availableCategories)
      .flat()
      .map(card => (card as Value).id);

    // Get cards that aren't in any category
    const remainingCards = session.initialValues.filter(
      card => !categorizedCards.includes(card.id)
    );

    initializeGameState(
      sessionId, 
      session.targetCoreValues,
      remainingCards,
      currentRoundData.availableCategories
    );
  } else {
    // If no round data (new round), initialize with the session's initial values
    initializeGameState(
      sessionId,
      session.targetCoreValues,
      session.initialValues,
      {
        'Very Important': [],
        'Quite Important': [],
        'Important': [],
        'Of Some Importance': [],
        'Not Important': []
      }
    );
  }

  return {
    session,
    currentRound: currentRoundData
  };
}
