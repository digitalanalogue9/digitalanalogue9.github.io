import { describe, expect, test } from 'vitest';
import { buildReplayFrames } from '@/app/replay/replayTimeline';
import type { RoundSnapshot, ValueCard } from '@/lib/contracts/types';

function makeCard(id: string): ValueCard {
  return {
    id,
    title: `Value ${id}`,
    description: `Description ${id}`,
  };
}

describe('buildReplayFrames', () => {
  test('replays historical command buckets before ending on the normalized completed summary', () => {
    const first = makeCard('a');
    const second = makeCard('b');
    const third = makeCard('c');
    const round: RoundSnapshot = {
      version: 2,
      sessionId: 'session-replay',
      roundNumber: 3,
      targetCoreValues: 2,
      deck: [],
      categories: {
        'Very Important': [first, second],
        'Quite Important': [],
        Important: [],
        'Of Some Importance': [],
        'Not Important': [third],
      },
      activeCategories: ['Very Important', 'Not Important'],
      commands: [
        { kind: 'drop', valueId: first.id, toCategory: 'Very Important' },
        { kind: 'drop', valueId: second.id, toCategory: 'Very Important' },
        { kind: 'drop', valueId: third.id, toCategory: 'Quite Important' },
      ],
      createdAt: 100,
      updatedAt: 200,
    };

    const frames = buildReplayFrames([round]);
    const historicalFrame = frames.find((frame) => frame.command?.valueId === third.id);
    const summaryFrame = frames.at(-1);

    expect(historicalFrame?.snapshot.activeCategories).toEqual(['Very Important', 'Quite Important', 'Not Important']);
    expect(historicalFrame?.snapshot.categories['Quite Important']).toEqual([third]);
    expect(summaryFrame?.usesSnapshotFallback).toBe(true);
    expect(summaryFrame?.snapshot.activeCategories).toEqual(['Very Important', 'Not Important']);
    expect(summaryFrame?.snapshot.categories['Not Important']).toEqual([third]);
  });

  test('replays a move into the stored snapshot without adding a fallback frame', () => {
    const card = makeCard('move-me');
    const round: RoundSnapshot = {
      version: 2,
      sessionId: 'session-move-replay',
      roundNumber: 1,
      targetCoreValues: 1,
      deck: [],
      categories: {
        'Very Important': [card],
        'Quite Important': [],
        Important: [],
        'Of Some Importance': [],
        'Not Important': [],
      },
      activeCategories: ['Very Important', 'Quite Important'],
      commands: [
        { kind: 'drop', valueId: card.id, toCategory: 'Quite Important' },
        { kind: 'move', valueId: card.id, fromCategory: 'Quite Important', toCategory: 'Very Important' },
      ],
      createdAt: 10,
      updatedAt: 12,
    };

    const frames = buildReplayFrames([round]);
    const startFrame = frames[0];
    const dropFrame = frames[1];
    const moveFrame = frames[2];

    expect(startFrame.snapshot.deck).toEqual([card]);
    expect(startFrame.snapshot.commands).toEqual([]);
    expect(startFrame.usesSnapshotFallback).toBe(false);
    expect(startFrame.commandStatus).toBe('Round ready to replay.');
    expect(dropFrame.commandIndex).toBe(1);
    expect(dropFrame.totalCommands).toBe(2);
    expect(dropFrame.snapshot.commands).toEqual([round.commands[0]]);
    expect(dropFrame.commandStatus).toBe('Placed Value move-me into Quite Important.');
    expect(moveFrame.snapshot.categories['Quite Important']).toEqual([]);
    expect(moveFrame.snapshot.categories['Very Important']).toEqual([card]);
    expect(moveFrame.commandIndex).toBe(2);
    expect(moveFrame.snapshot.commands).toEqual(round.commands);
    expect(moveFrame.commandStatus).toBe('Moved Value move-me from Quite Important to Very Important.');
    expect(frames).toHaveLength(3);
    expect(frames.at(-1)?.usesSnapshotFallback).toBe(false);
  });

  test('uses the saved snapshot when replayed commands do not reproduce its categories', () => {
    const card = makeCard('snapshot-value');
    const round: RoundSnapshot = {
      version: 2,
      sessionId: 'session-snapshot-fallback',
      roundNumber: 2,
      targetCoreValues: 1,
      deck: [],
      categories: {
        'Very Important': [card],
        'Quite Important': [],
        Important: [],
        'Of Some Importance': [],
        'Not Important': [],
      },
      activeCategories: ['Very Important', 'Quite Important'],
      commands: [{ kind: 'drop', valueId: card.id, toCategory: 'Quite Important' }],
      createdAt: 20,
      updatedAt: 21,
    };

    const frames = buildReplayFrames([round]);
    const fallbackFrame = frames.at(-1);

    expect(fallbackFrame?.usesSnapshotFallback).toBe(true);
    expect(fallbackFrame?.commandStatus).toBe('Showing the saved round snapshot.');
    expect(fallbackFrame?.snapshot.categories['Very Important']).toEqual([card]);
  });

  test('restores a historical source category even when it is absent from the saved active categories', () => {
    const card = makeCard('historical-category');
    const round: RoundSnapshot = {
      version: 2,
      sessionId: 'session-historical-category',
      roundNumber: 2,
      targetCoreValues: 1,
      deck: [],
      categories: {
        'Very Important': [card],
        'Quite Important': [],
        Important: [],
        'Of Some Importance': [],
        'Not Important': [],
      },
      activeCategories: ['Very Important'],
      commands: [
        { kind: 'drop', valueId: card.id, toCategory: 'Quite Important' },
        { kind: 'move', valueId: card.id, fromCategory: 'Quite Important', toCategory: 'Very Important' },
      ],
      createdAt: 30,
      updatedAt: 32,
    };

    const frames = buildReplayFrames([round]);
    const moveFrame = frames[2];
    const fallbackFrame = frames.at(-1);

    expect(moveFrame.snapshot.activeCategories).toEqual(['Very Important', 'Quite Important']);
    expect(moveFrame.snapshot.categories['Very Important']).toEqual([card]);
    expect(fallbackFrame?.usesSnapshotFallback).toBe(true);
    expect(fallbackFrame?.snapshot.activeCategories).toEqual(['Very Important']);
  });
});
