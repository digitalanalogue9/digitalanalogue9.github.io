import teamValuesData from '@/data/team-values.json';
import valuesData from '@/data/values.json';
import type { ExerciseType, SessionReflection, ValueCard } from '@/lib/contracts/types';

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

export type ReflectionRelationship = {
  id: string;
  valueIds: [string, string];
  title: string;
  personal: string;
  team: string;
};

export type ReflectionSummaryItem = {
  valueTitle: string;
  text: string;
  attribution:
    | 'Self-reported'
    | 'Recorded in team discussion'
    | 'Participant note'
    | 'Recorder note'
    | 'Reflection possibility'
    | 'Curated relationship possibility';
  status?: 'unsure' | 'unanswered' | 'relationship';
};

export type ReflectionSummary = {
  recognisedPossibilities: ReflectionSummaryItem[];
  observations: ReflectionSummaryItem[];
  actions: ReflectionSummaryItem[];
  unconfirmedPossibilities: ReflectionSummaryItem[];
};

function addSummaryNote(
  target: ReflectionSummaryItem[],
  valueTitle: string,
  text: string,
  exerciseType: ExerciseType
): void {
  if (!text.trim()) return;
  target.push({
    valueTitle,
    text,
    attribution: exerciseType === 'team' ? 'Recorder note' : 'Participant note',
  });
}

function getPossibilitySummaryItem(
  exerciseType: ExerciseType,
  valueTitle: string,
  possibility: ReflectionPossibility,
  response: string | undefined
): ReflectionSummaryItem {
  return {
    valueTitle,
    text: possibility[exerciseType],
    attribution:
      response === 'recognised'
        ? exerciseType === 'team'
          ? 'Recorded in team discussion'
          : 'Self-reported'
        : 'Reflection possibility',
  };
}

function addValueReflectionSummary(
  summary: ReflectionSummary,
  exerciseType: ExerciseType,
  value: ValueCard,
  reflection: SessionReflection | undefined
): void {
  const notes = reflection?.values[value.id];
  addSummaryNote(summary.observations, value.title, notes?.observation ?? '', exerciseType);
  addSummaryNote(summary.actions, value.title, notes?.action ?? '', exerciseType);
  for (const possibility of getReflectionContent(exerciseType, value).possibilities) {
    const response = notes?.suggestions?.[possibility.id];
    if (response === 'rejected') continue;
    const item = getPossibilitySummaryItem(exerciseType, value.title, possibility, response);
    if (response === 'recognised') summary.recognisedPossibilities.push(item);
    else summary.unconfirmedPossibilities.push({ ...item, status: response === 'unsure' ? 'unsure' : 'unanswered' });
  }
}

function addRelationshipReflectionSummary(
  summary: ReflectionSummary,
  relationship: ReflectionRelationship,
  reflection: SessionReflection | undefined,
  exerciseType: ExerciseType
): void {
  summary.unconfirmedPossibilities.push({
    valueTitle: relationship.title,
    text: relationship[exerciseType],
    attribution: 'Curated relationship possibility',
    status: 'relationship',
  });
  const notes = reflection?.relationships?.[relationship.id];
  addSummaryNote(summary.observations, relationship.title, notes?.observation ?? '', exerciseType);
  addSummaryNote(summary.actions, relationship.title, notes?.action ?? '', exerciseType);
}

type CuratedRelationship = Omit<ReflectionRelationship, 'title'> & {
  exerciseType: ExerciseType;
  valueTitles: [string, string];
};

const curatedRelationships: CuratedRelationship[] = [
  {
    exerciseType: 'personal',
    id: 'personal-fast-pace-precise-work',
    valueIds: ['2', '7'],
    valueTitles: ['FAST PACE', 'PRECISE WORK'],
    personal:
      'A fast pace and precise work might complement each other when you can move quickly while allowing enough time to check important details.',
    team: 'A fast pace and precise work might complement each other when we can move quickly while allowing enough time to check important details.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-independence-work-with-others',
    valueIds: ['31', '32'],
    valueTitles: ['INDEPENDENCE', 'WORK WITH OTHERS'],
    personal:
      'Independence and working with others might complement each other when you can take ownership while drawing on useful collaboration.',
    team: 'Independence and working with others might complement each other when people can take ownership while drawing on useful collaboration.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-security-risk',
    valueIds: ['19', '22'],
    valueTitles: ['SECURITY', 'RISK'],
    personal:
      'Security and risk might both matter when you weigh what needs protecting against what may be worth trying.',
    team: 'Security and risk might both matter when we weigh what needs protecting against what may be worth trying.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-promotion-time-freedom',
    valueIds: ['18', '15'],
    valueTitles: ['PROMOTION', 'TIME FREEDOM'],
    personal:
      'Promotion and time freedom might both matter as you consider opportunities alongside how you want to use your time.',
    team: 'Promotion and time freedom might both matter as people consider opportunities alongside how they want to use their time.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-routine-variety',
    valueIds: ['13', '12'],
    valueTitles: ['ROUTINE', 'VARIETY'],
    personal:
      'Routine and variety might complement each other when a reliable structure leaves room for new experiences.',
    team: 'Routine and variety might complement each other when a reliable structure leaves room for new experiences.',
  },
  {
    exerciseType: 'team',
    id: 'team-excellence-balance',
    valueIds: ['12', '9'],
    valueTitles: ['EXCELLENCE', 'BALANCE'],
    personal:
      'Excellence and balance might both matter as you consider high standards alongside sustainable workloads.',
    team: 'Excellence and balance might both matter as we consider high standards alongside sustainable workloads.',
  },
  {
    exerciseType: 'team',
    id: 'team-innovation-standards',
    valueIds: ['23', '28'],
    valueTitles: ['INNOVATION', 'STANDARDS'],
    personal:
      'Innovation and standards might complement each other when new ideas are explored with clear expectations for quality.',
    team: 'Innovation and standards might complement each other when we explore new ideas with clear expectations for quality.',
  },
  {
    exerciseType: 'team',
    id: 'team-transparency-empathy',
    valueIds: ['22', '11'],
    valueTitles: ['TRANSPARENCY', 'EMPATHY'],
    personal:
      'Transparency and empathy might complement each other when openness is paired with care for how conversations affect people.',
    team: 'Transparency and empathy might complement each other when we pair openness with care for how conversations affect people.',
  },
  {
    exerciseType: 'team',
    id: 'team-accountability-safety',
    valueIds: ['20', '18'],
    valueTitles: ['ACCOUNTABILITY', 'SAFETY'],
    personal:
      'Accountability and safety might complement each other when people can raise concerns and take responsibility without blame.',
    team: 'Accountability and safety might complement each other when people can raise concerns and take responsibility without blame.',
  },
  {
    exerciseType: 'team',
    id: 'team-focus-flexibility',
    valueIds: ['26', '29'],
    valueTitles: ['FOCUS', 'FLEXIBILITY'],
    personal:
      'Focus and flexibility might complement each other when priorities are clear and the team can adapt as circumstances change.',
    team: 'Focus and flexibility might complement each other when priorities are clear and we can adapt as circumstances change.',
  },
];

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

export function getReflectionRelationships(
  exerciseType: ExerciseType,
  selectedValues: ValueCard[]
): ReflectionRelationship[] {
  return curatedRelationships.flatMap((relationship) => {
    if (relationship.exerciseType !== exerciseType) return [];
    const selected = relationship.valueIds.map((valueId) => {
      return selectedValues.find((value) => {
        return value.id === valueId;
      });
    });
    const cards = exerciseType === 'team' ? teamCards : personalCards;
    const valid = selected.every((value, index) => {
      const canonical = cards.get(relationship.valueIds[index]);
      return (
        value !== undefined &&
        canonical !== undefined &&
        value.title === relationship.valueTitles[index] &&
        value.title === canonical.title &&
        value.description === canonical.description
      );
    });
    return valid
      ? [
          {
            id: relationship.id,
            valueIds: relationship.valueIds,
            title: relationship.valueTitles.join(' / '),
            personal: relationship.personal,
            team: relationship.team,
          },
        ]
      : [];
  });
}

export function getReflectionSummary(
  exerciseType: ExerciseType,
  selectedValues: ValueCard[],
  reflection?: SessionReflection
): ReflectionSummary {
  const summary: ReflectionSummary = {
    recognisedPossibilities: [],
    observations: [],
    actions: [],
    unconfirmedPossibilities: [],
  };
  for (const value of selectedValues) {
    addValueReflectionSummary(summary, exerciseType, value, reflection);
  }

  for (const relationship of getReflectionRelationships(exerciseType, selectedValues)) {
    addRelationshipReflectionSummary(summary, relationship, reflection, exerciseType);
  }

  return summary;
}

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
