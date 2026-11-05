import teamValuesData from '@/data/team-values.json';
import valuesData from '@/data/values.json';
import type { ExerciseType, ValueCard } from '@/lib/contracts/types';

export type ReflectionLens = 'constructive' | 'overplayed' | 'frustrated';

export type ReflectionPossibility = {
  id: string;
  lens: ReflectionLens;
  personal: string;
  team: string;
};

export type ReflectionContent = {
  questions: {
    personal: string[];
    team: string[];
  };
  possibilities: ReflectionPossibility[];
};

type CuratedValue = {
  exerciseType: ExerciseType;
  valueId: string;
  title: string;
  description: string;
  possibilities: ReflectionPossibility[];
};

const curatedValues: CuratedValue[] = [
  {
    exerciseType: 'personal',
    valueId: '2',
    title: 'FAST PACE',
    description: 'You enjoy working rapidly at a high pace.',
    possibilities: [
      {
        id: 'personal-fast-pace-constructive',
        lens: 'constructive',
        personal: 'A fast pace might help me create momentum when a decision or response is needed.',
        team: 'A fast pace might help us create momentum when a decision or response is needed.',
      },
      {
        id: 'personal-fast-pace-overplayed',
        lens: 'overplayed',
        personal: 'I might move ahead before I have checked whether others have the context they need.',
        team: 'We might move ahead before everyone has the context they need.',
      },
      {
        id: 'personal-fast-pace-frustrated',
        lens: 'frustrated',
        personal: 'I might feel frustrated when avoidable delays make it hard to keep work moving.',
        team: 'People might feel frustrated when avoidable delays make it hard to keep work moving.',
      },
    ],
  },
  {
    exerciseType: 'team',
    valueId: '12',
    title: 'EXCELLENCE',
    description: 'We strive for the highest standards in everything we do, inspiring ourselves and others to excel.',
    possibilities: [
      {
        id: 'team-excellence-constructive',
        lens: 'constructive',
        personal: 'A shared commitment to quality might help us learn from our work and improve it.',
        team: 'A shared commitment to quality might help us learn from our work and improve it.',
      },
      {
        id: 'team-excellence-overplayed',
        lens: 'overplayed',
        personal: 'We might keep refining work after it is good enough for the need and timing.',
        team: 'We might keep refining work after it is good enough for the need and timing.',
      },
      {
        id: 'team-excellence-frustrated',
        lens: 'frustrated',
        personal: 'People might feel frustrated when they lack the time or support to meet the quality they expect.',
        team: 'People might feel frustrated when they lack the time or support to meet the quality they expect.',
      },
    ],
  },
];

const personalCards = new Map((valuesData.values as ValueCard[]).map((value) => [value.id, value]));
const teamCards = new Map((teamValuesData.values as ValueCard[]).map((value) => [value.id, value]));

export function getReflectionContent(exerciseType: ExerciseType, value: ValueCard): ReflectionContent {
  const card = (exerciseType === 'team' ? teamCards : personalCards).get(value.id);
  const match = curatedValues.find(
    (candidate) =>
      candidate.exerciseType === exerciseType &&
      candidate.valueId === value.id &&
      candidate.title === value.title &&
      candidate.description === value.description &&
      card?.title === value.title &&
      card.description === value.description
  );

  return {
    questions: {
      personal: [
        `Where have you seen ${value.title} shape your choices at work?`,
        `What situations might make it harder for you to put ${value.title} into practice?`,
      ],
      team: [
        `Where have we seen ${value.title} shape the way we work together?`,
        `What conditions might make it harder for the team to put ${value.title} into practice?`,
      ],
    },
    possibilities: match?.possibilities ?? [],
  };
}
