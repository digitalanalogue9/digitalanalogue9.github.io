import { CATEGORY_ORDER, SCHEMA_VERSION } from '@/lib/contracts/constants';
import {
  CategoriesState,
  CategoryName,
  DropCommand,
  MoveCommand,
  RoundCommand,
  RoundSnapshot,
  RoundTransitionResult,
  ValueCard,
} from '@/lib/contracts/types';

export type AdvanceRoundResult =
  | {
      kind: 'next-round';
      round: RoundSnapshot;
    }
  | {
      kind: 'ready-to-complete';
      round: RoundSnapshot;
      finalValues: ValueCard[];
    };

function shuffle<T>(items: T[]): T[] {
  const values = [...items];
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const item = values[index];
    values[index] = values[swapIndex];
    values[swapIndex] = item;
  }
  return values;
}

export function createEmptyCategories(): CategoriesState {
  return CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as CategoriesState);
}

export function getActiveCategoriesForRound(cardsInRound: number, targetCoreValues: number): CategoryName[] {
  const ratio = cardsInRound / targetCoreValues;
  if (ratio <= 1.5) return ['Very Important', 'Not Important'];
  if (ratio <= 2) return ['Very Important', 'Quite Important', 'Not Important'];
  if (ratio <= 3) return ['Very Important', 'Quite Important', 'Important', 'Not Important'];
  return [...CATEGORY_ORDER];
}

export function createInitialRoundSnapshot(
  sessionId: string,
  values: ValueCard[],
  targetCoreValues: number,
  createdAt: number
): RoundSnapshot {
  return {
    version: SCHEMA_VERSION,
    sessionId,
    roundNumber: 1,
    targetCoreValues,
    deck: shuffle(values),
    categories: createEmptyCategories(),
    activeCategories: getActiveCategoriesForRound(values.length, targetCoreValues),
    commands: [],
    createdAt,
    updatedAt: createdAt,
  };
}

function removeById(values: ValueCard[], valueId: string): { next: ValueCard[]; removed?: ValueCard } {
  const index = values.findIndex((value) => value.id === valueId);
  if (index < 0) return { next: values };
  const next = [...values];
  const [removed] = next.splice(index, 1);
  return { next, removed };
}

function insertAt(values: ValueCard[], value: ValueCard, toIndex?: number): ValueCard[] {
  const next = [...values];
  if (typeof toIndex === 'number' && toIndex >= 0 && toIndex <= next.length) {
    next.splice(toIndex, 0, value);
    return next;
  }
  next.push(value);
  return next;
}

function applyDropCommand(round: RoundSnapshot, command: DropCommand, now: number): RoundSnapshot {
  if (!round.activeCategories.includes(command.toCategory)) return round;
  const fromDeck = removeById(round.deck, command.valueId);
  if (!fromDeck.removed) return round;

  const nextCategories = {
    ...round.categories,
    [command.toCategory]: insertAt(round.categories[command.toCategory], fromDeck.removed, command.toIndex),
  };

  return {
    ...round,
    deck: fromDeck.next,
    categories: nextCategories,
    commands: [...round.commands, command],
    updatedAt: now,
  };
}

function applyMoveCommand(round: RoundSnapshot, command: MoveCommand, now: number): RoundSnapshot {
  if (!round.activeCategories.includes(command.fromCategory)) return round;
  if (!round.activeCategories.includes(command.toCategory)) return round;

  const fromValues = round.categories[command.fromCategory];
  const fromIndex =
    typeof command.fromIndex === 'number'
      ? command.fromIndex
      : fromValues.findIndex((value) => value.id === command.valueId);

  if (fromIndex < 0 || fromIndex >= fromValues.length) return round;

  const value = fromValues[fromIndex];
  const nextFrom = [...fromValues];
  nextFrom.splice(fromIndex, 1);

  const toValues = command.fromCategory === command.toCategory ? nextFrom : round.categories[command.toCategory];
  const nextTo = insertAt(toValues, value, command.toIndex);

  const nextCategories = {
    ...round.categories,
    [command.fromCategory]: command.fromCategory === command.toCategory ? nextTo : nextFrom,
    [command.toCategory]: nextTo,
  };

  return {
    ...round,
    categories: nextCategories,
    commands: [...round.commands, command],
    updatedAt: now,
  };
}

export function applyRoundCommand(round: RoundSnapshot, command: RoundCommand, now: number): RoundSnapshot {
  if (command.kind === 'drop') return applyDropCommand(round, command, now);
  return applyMoveCommand(round, command, now);
}

function activeCardsCount(round: RoundSnapshot): number {
  return round.activeCategories
    .filter((category) => category !== 'Not Important')
    .reduce((sum, category) => sum + round.categories[category].length, 0);
}

export function evaluateRoundTransition(round: RoundSnapshot): RoundTransitionResult {
  const deckEmpty = round.deck.length === 0;
  const veryImportantCount = round.categories['Very Important'].length;
  const notImportantCount = round.categories['Not Important'].length;
  const activeCount = activeCardsCount(round);

  const hasEnoughCards = activeCount >= round.targetCoreValues;
  const hasNotImportant = notImportantCount > 0;
  const canComplete = deckEmpty && veryImportantCount === round.targetCoreValues && activeCount === veryImportantCount;
  const canAdvance = deckEmpty && hasEnoughCards && hasNotImportant;
  const canEarlyFinish = deckEmpty && hasEnoughCards;

  if (!deckEmpty) {
    return {
      canAdvance,
      canComplete,
      canEarlyFinish,
      message: 'Place all remaining cards before continuing.',
    };
  }
  if (!hasEnoughCards) {
    return {
      canAdvance,
      canComplete,
      canEarlyFinish,
      message: `You need at least ${round.targetCoreValues} active cards to continue.`,
    };
  }
  if (canComplete) {
    return {
      canAdvance,
      canComplete,
      canEarlyFinish,
      message: 'You are ready to complete the exercise.',
    };
  }
  if (!hasNotImportant) {
    return {
      canAdvance,
      canComplete,
      canEarlyFinish,
      message: 'Keep at least one value in Not Important to end a round.',
    };
  }
  return {
    canAdvance,
    canComplete,
    canEarlyFinish,
    message: 'Start the next round or finish early.',
  };
}

export function normalizeRoundForCompletion(round: RoundSnapshot, now: number): RoundSnapshot {
  const priority: CategoryName[] = [
    'Very Important',
    'Quite Important',
    'Important',
    'Of Some Importance',
    'Not Important',
  ];

  const promoted: ValueCard[] = [];
  const demoted: ValueCard[] = [];

  for (const category of priority) {
    for (const card of round.categories[category]) {
      if (promoted.length < round.targetCoreValues) {
        promoted.push(card);
      } else {
        demoted.push(card);
      }
    }
  }

  const nextCategories = createEmptyCategories();
  nextCategories['Very Important'] = promoted;
  nextCategories['Not Important'] = demoted;

  return {
    ...round,
    categories: nextCategories,
    activeCategories: ['Very Important', 'Not Important'],
    updatedAt: now,
  };
}

export function mapCategoryForRound(originalCategory: CategoryName, activeCategories: CategoryName[]): CategoryName {
  if (activeCategories.includes(originalCategory)) return originalCategory;

  const priorityOrder = CATEGORY_ORDER;
  const startIndex = priorityOrder.indexOf(originalCategory);

  // Walk forward from the original position to find the next active category
  for (let i = startIndex + 1; i < priorityOrder.length; i++) {
    if (activeCategories.includes(priorityOrder[i])) return priorityOrder[i];
  }

  // Fallback: last active category (always 'Not Important' in this game)
  return activeCategories[activeCategories.length - 1];
}

export function buildPreviousRoundReplayCommands(
  currentDeck: ValueCard[],
  previousCommands: RoundCommand[],
  activeCategories: CategoryName[]
): DropCommand[] {
  return currentDeck.flatMap((card) => {
    // Find the last command that placed this card in the previous round
    const lastCommand = [...previousCommands].reverse().find((cmd) => cmd.valueId === card.id);
    if (!lastCommand) return [];

    const originalCategory = lastCommand.kind === 'drop' ? lastCommand.toCategory : lastCommand.toCategory;
    const toCategory = mapCategoryForRound(originalCategory, activeCategories);

    return [{ kind: 'drop' as const, valueId: card.id, toCategory }];
  });
}

export function advanceRoundState(round: RoundSnapshot, now: number, useEarlyFinish: boolean): AdvanceRoundResult {
  const transition = evaluateRoundTransition(round);
  if (useEarlyFinish) {
    if (!transition.canEarlyFinish) {
      throw new Error(transition.message);
    }
    const rebalanced = normalizeRoundForCompletion(round, now);
    return {
      kind: 'ready-to-complete',
      round: rebalanced,
      finalValues: rebalanced.categories['Very Important'],
    };
  }

  if (transition.canComplete) {
    const normalized = normalizeRoundForCompletion(round, now);
    return {
      kind: 'ready-to-complete',
      round: normalized,
      finalValues: normalized.categories['Very Important'],
    };
  }

  if (!transition.canAdvance) {
    throw new Error(transition.message);
  }

  const nextDeck = shuffle(
    round.activeCategories
      .filter((category) => category !== 'Not Important')
      .flatMap((category) => round.categories[category])
  );
  const nextRoundNumber = round.roundNumber + 1;
  const nextActiveCategories = getActiveCategoriesForRound(nextDeck.length, round.targetCoreValues);

  return {
    kind: 'next-round',
    round: {
      version: SCHEMA_VERSION,
      sessionId: round.sessionId,
      roundNumber: nextRoundNumber,
      targetCoreValues: round.targetCoreValues,
      deck: nextDeck,
      categories: createEmptyCategories(),
      activeCategories: nextActiveCategories,
      commands: [],
      createdAt: now,
      updatedAt: now,
    },
  };
}
