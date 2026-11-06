import { CATEGORY_ORDER } from '@/lib/contracts/constants';
import { RoundSnapshot, type RoundCommand, type ValueCard } from '@/lib/contracts/types';
import { applyRoundCommand, createEmptyCategories } from '@/lib/domain/roundEngine';

export type ReplayFrame = {
  id: string;
  roundIndex: number;
  totalRounds: number;
  roundNumber: number;
  commandIndex: number;
  totalCommands: number;
  snapshot: RoundSnapshot;
  command?: RoundCommand;
  commandStatus: string;
  usesSnapshotFallback: boolean;
};

function buildCardMap(round: RoundSnapshot): Map<string, ValueCard> {
  const cards = [...round.deck, ...Object.values(round.categories).flat()];
  return new Map(cards.map((card) => [card.id, card]));
}

function buildInitialDeck(round: RoundSnapshot, cardMap: Map<string, ValueCard>): ValueCard[] {
  const droppedCards: ValueCard[] = [];
  const droppedIds = new Set<string>();

  for (const command of round.commands) {
    if (command.kind !== 'drop' || droppedIds.has(command.valueId)) {
      continue;
    }

    const card = cardMap.get(command.valueId);
    if (card) {
      droppedCards.push(card);
      droppedIds.add(command.valueId);
    }
  }

  return [...droppedCards, ...round.deck];
}

function getReplayActiveCategories(round: RoundSnapshot): RoundSnapshot['activeCategories'] {
  const categories = new Set(round.activeCategories);

  for (const command of round.commands) {
    categories.add(command.toCategory);
    if (command.kind === 'move') {
      categories.add(command.fromCategory);
    }
  }

  return CATEGORY_ORDER.filter((category) => categories.has(category));
}

function buildInitialSnapshot(round: RoundSnapshot): RoundSnapshot {
  const cardMap = buildCardMap(round);

  return {
    ...round,
    deck: buildInitialDeck(round, cardMap),
    categories: createEmptyCategories(),
    activeCategories: getReplayActiveCategories(round),
    commands: [],
    updatedAt: round.createdAt,
  };
}

function getValueIds(values: ValueCard[]): string[] {
  return values.map((value) => value.id);
}

function matchesStoredSnapshot(left: RoundSnapshot, right: RoundSnapshot): boolean {
  if (left.deck.length !== right.deck.length) {
    return false;
  }

  if (left.activeCategories.join('|') !== right.activeCategories.join('|')) {
    return false;
  }

  if (getValueIds(left.deck).join('|') !== getValueIds(right.deck).join('|')) {
    return false;
  }

  for (const category of CATEGORY_ORDER) {
    if (getValueIds(left.categories[category]).join('|') !== getValueIds(right.categories[category]).join('|')) {
      return false;
    }
  }

  return true;
}

function describeCommand(
  command: RoundCommand | undefined,
  cardMap: Map<string, ValueCard>,
  usesSnapshotFallback: boolean
): string {
  if (usesSnapshotFallback) {
    return 'Showing the saved round snapshot.';
  }

  if (!command) {
    return 'Round ready to replay.';
  }

  const title = cardMap.get(command.valueId)?.title ?? 'Unknown value';

  if (command.kind === 'drop') {
    return `Placed ${title} into ${command.toCategory}.`;
  }

  return `Moved ${title} from ${command.fromCategory} to ${command.toCategory}.`;
}

export function buildReplayFrames(rounds: RoundSnapshot[]): ReplayFrame[] {
  const frames: ReplayFrame[] = [];

  rounds.forEach((round, roundIndex) => {
    const cardMap = buildCardMap(round);
    const totalRounds = rounds.length;
    const totalCommands = round.commands.length;
    const initialSnapshot = buildInitialSnapshot(round);

    frames.push({
      id: `${round.sessionId}-round-${round.roundNumber}-start`,
      roundIndex,
      totalRounds,
      roundNumber: round.roundNumber,
      commandIndex: 0,
      totalCommands,
      snapshot: initialSnapshot,
      commandStatus: describeCommand(undefined, cardMap, false),
      usesSnapshotFallback: false,
    });

    let currentSnapshot = initialSnapshot;

    round.commands.forEach((command, commandIndex) => {
      currentSnapshot = applyRoundCommand(currentSnapshot, command, round.createdAt + commandIndex + 1);

      frames.push({
        id: `${round.sessionId}-round-${round.roundNumber}-command-${commandIndex + 1}`,
        roundIndex,
        totalRounds,
        roundNumber: round.roundNumber,
        commandIndex: commandIndex + 1,
        totalCommands,
        snapshot: currentSnapshot,
        command,
        commandStatus: describeCommand(command, cardMap, false),
        usesSnapshotFallback: false,
      });
    });

    if (!matchesStoredSnapshot(currentSnapshot, round)) {
      frames.push({
        id: `${round.sessionId}-round-${round.roundNumber}-snapshot`,
        roundIndex,
        totalRounds,
        roundNumber: round.roundNumber,
        commandIndex: totalCommands,
        totalCommands,
        snapshot: round,
        commandStatus: describeCommand(undefined, cardMap, true),
        usesSnapshotFallback: true,
      });
    }
  });

  return frames;
}
