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
});
