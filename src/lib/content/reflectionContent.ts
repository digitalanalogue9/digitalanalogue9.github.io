import legacyTeamDescriptions from '@/data/team-values-legacy-descriptions.json';
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
  {
    exerciseType: 'personal',
    id: 'personal-work-alone-contact-with-people',
    valueIds: ['5', '14'],
    valueTitles: ['WORK ALONE', 'CONTACT WITH PEOPLE'],
    personal:
      'Working alone and contact with people may call for different kinds of time. Consider when uninterrupted work helps and when conversation is valuable.',
    team: 'Working alone and contact with people may call for different kinds of time. Consider when uninterrupted work helps and when conversation is valuable.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-work-alone-work-with-others',
    valueIds: ['5', '32'],
    valueTitles: ['WORK ALONE', 'WORK WITH OTHERS'],
    personal:
      'Working alone and working with others can both be rewarding. Consider which tasks benefit from solitude and which benefit from collaboration.',
    team: 'Working alone and working with others can both be rewarding. Consider which tasks benefit from solitude and which benefit from collaboration.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-pressure-peace',
    valueIds: ['4', '33'],
    valueTitles: ['PRESSURE', 'PEACE'],
    personal:
      'Deadlines can create focus, while peace can leave room to think. Consider how much pressure helps before it becomes too much.',
    team: 'Deadlines can create focus, while peace can leave room to think. Consider how much pressure helps before it becomes too much.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-excitement-peace',
    valueIds: ['26', '33'],
    valueTitles: ['EXCITEMENT', 'PEACE'],
    personal:
      'Excitement and peace may matter at different times. Consider where you want stimulation and where you need space to recharge.',
    team: 'Excitement and peace may matter at different times. Consider where you want stimulation and where you need space to recharge.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-challenge-peace',
    valueIds: ['28', '33'],
    valueTitles: ['CHALLENGE', 'PEACE'],
    personal:
      'New challenges can be energising and demanding. Consider what support or breathing space helps you take them on.',
    team: 'New challenges can be energising and demanding. Consider what support or breathing space helps you take them on.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-pressure-precise-work',
    valueIds: ['4', '7'],
    valueTitles: ['PRESSURE', 'PRECISE WORK'],
    personal:
      'Deadlines and careful work can compete for time. Consider which details need checking when the pressure is on.',
    team: 'Deadlines and careful work can compete for time. Consider which details need checking when the pressure is on.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-routine-time-freedom',
    valueIds: ['13', '15'],
    valueTitles: ['ROUTINE', 'TIME FREEDOM'],
    personal:
      'A predictable routine and freedom over your time can both be useful. Consider which commitments need structure and where you want flexibility.',
    team: 'A predictable routine and freedom over your time can both be useful. Consider which commitments need structure and where you want flexibility.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-competition-work-with-others',
    valueIds: ['6', '32'],
    valueTitles: ['COMPETITION', 'WORK WITH OTHERS'],
    personal:
      'Competition and teamwork may pull in different directions. Consider how to pursue a challenge while supporting the people around you.',
    team: 'Competition and teamwork may pull in different directions. Consider how to pursue a challenge while supporting the people around you.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-security-promotion',
    valueIds: ['19', '18'],
    valueTitles: ['SECURITY', 'PROMOTION'],
    personal:
      'A promotion may offer opportunity while bringing uncertainty. Consider what stability you need when weighing a new role.',
    team: 'A promotion may offer opportunity while bringing uncertainty. Consider what stability you need when weighing a new role.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-time-freedom-friendship',
    valueIds: ['15', '20'],
    valueTitles: ['TIME FREEDOM', 'FRIENDSHIP'],
    personal:
      'Freedom over your time and friendships at work may both matter. Consider how to make space for colleagues while keeping control of your schedule.',
    team: 'Freedom over your time and friendships at work may both matter. Consider how to make space for colleagues while keeping control of your schedule.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-money-help-society',
    valueIds: ['3', '24'],
    valueTitles: ['MONEY', 'HELP SOCIETY'],
    personal:
      'Earning money and contributing to society may shape your choices in different ways. Consider what you need from each when weighing an opportunity.',
    team: 'Earning money and contributing to society may shape your choices in different ways. Consider what you need from each when weighing an opportunity.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-place-of-work-promotion',
    valueIds: ['25', '18'],
    valueTitles: ['PLACE OF WORK', 'PROMOTION'],
    personal:
      'The right location and a promotion may not always be available together. Consider what you are willing to change for an opportunity.',
    team: 'The right location and a promotion may not always be available together. Consider what you are willing to change for an opportunity.',
  },
  {
    exerciseType: 'team',
    id: 'team-dedication-balance',
    valueIds: ['8', '9'],
    valueTitles: ['DEDICATION', 'BALANCE'],
    personal:
      'Commitment and balance may pull in different directions when demands rise. Consider how we can follow through without relying on unsustainable workloads.',
    team: 'Commitment and balance may pull in different directions when demands rise. Consider how we can follow through without relying on unsustainable workloads.',
  },
  {
    exerciseType: 'team',
    id: 'team-persistence-adaptability',
    valueIds: ['27', '4'],
    valueTitles: ['PERSISTENCE', 'ADAPTABILITY'],
    personal:
      'Persistence can help us work through setbacks, while adaptability can prompt a change of approach. Consider when to keep going and when to adjust.',
    team: 'Persistence can help us work through setbacks, while adaptability can prompt a change of approach. Consider when to keep going and when to adjust.',
  },
  {
    exerciseType: 'team',
    id: 'team-courage-safety',
    valueIds: ['25', '18'],
    valueTitles: ['COURAGE', 'SAFETY'],
    personal:
      'Courage and safety can support each other. Consider how we can make room for considered risks and help people speak up about concerns.',
    team: 'Courage and safety can support each other. Consider how we can make room for considered risks and help people speak up about concerns.',
  },
  {
    exerciseType: 'team',
    id: 'team-clarity-empathy',
    valueIds: ['7', '11'],
    valueTitles: ['CLARITY', 'EMPATHY'],
    personal:
      'Clear feedback and empathy both matter in difficult conversations. Consider how we can be direct while attending to the person receiving it.',
    team: 'Clear feedback and empathy both matter in difficult conversations. Consider how we can be direct while attending to the person receiving it.',
  },
  {
    exerciseType: 'team',
    id: 'team-leadership-inclusivity',
    valueIds: ['14', '6'],
    valueTitles: ['LEADERSHIP', 'INCLUSIVITY'],
    personal:
      'Leadership can provide direction, while inclusivity makes space for different perspectives. Consider how we invite contributions when a decision needs to be made.',
    team: 'Leadership can provide direction, while inclusivity makes space for different perspectives. Consider how we invite contributions when a decision needs to be made.',
  },
  {
    exerciseType: 'team',
    id: 'team-alignment-creativity',
    valueIds: ['33', '10'],
    valueTitles: ['ALIGNMENT', 'CREATIVITY'],
    personal:
      'Shared objectives and creative exploration can support each other. Consider where we can try different approaches while keeping the goal in view.',
    team: 'Shared objectives and creative exploration can support each other. Consider where we can try different approaches while keeping the goal in view.',
  },
  {
    exerciseType: 'team',
    id: 'team-transparency-safety',
    valueIds: ['22', '18'],
    valueTitles: ['TRANSPARENCY', 'SAFETY'],
    personal:
      'Openness and safety both matter when information is sensitive. Consider how we can share what people need while respecting privacy and making it safe to speak.',
    team: 'Openness and safety both matter when information is sensitive. Consider how we can share what people need while respecting privacy and making it safe to speak.',
  },
  {
    exerciseType: 'team',
    id: 'team-resourcefulness-standards',
    valueIds: ['34', '28'],
    valueTitles: ['RESOURCEFULNESS', 'STANDARDS'],
    personal:
      'Limited resources and high standards can create difficult choices. Consider what quality requires and where we can find another way.',
    team: 'Limited resources and high standards can create difficult choices. Consider what quality requires and where we can find another way.',
  },
  {
    exerciseType: 'team',
    id: 'team-focus-inclusivity',
    valueIds: ['26', '6'],
    valueTitles: ['FOCUS', 'INCLUSIVITY'],
    personal:
      'Focus can help us make progress, while inclusivity gives people space to contribute. Consider how we can hear different perspectives and still move forward.',
    team: 'Focus can help us make progress, while inclusivity gives people space to contribute. Consider how we can hear different perspectives and still move forward.',
  },
  {
    exerciseType: 'team',
    id: 'team-accountability-empathy',
    valueIds: ['20', '11'],
    valueTitles: ['ACCOUNTABILITY', 'EMPATHY'],
    personal:
      'Accountability and empathy can both guide a response when something goes wrong. Consider how we can address responsibilities while understanding the circumstances.',
    team: 'Accountability and empathy can both guide a response when something goes wrong. Consider how we can address responsibilities while understanding the circumstances.',
  },
  {
    exerciseType: 'team',
    id: 'team-excellence-innovation',
    valueIds: ['12', '23'],
    valueTitles: ['EXCELLENCE', 'INNOVATION'],
    personal:
      'High standards and trying new approaches can create different pressures. Consider what is safe to experiment with and what needs more assurance.',
    team: 'High standards and trying new approaches can create different pressures. Consider what is safe to experiment with and what needs more assurance.',
  },
  {
    exerciseType: 'team',
    id: 'team-teamwork-focus',
    valueIds: ['2', '26'],
    valueTitles: ['TEAMWORK', 'FOCUS'],
    personal:
      'Working together and protecting focused time may call for different ways of working. Consider when to collaborate and when to make space for individual work.',
    team: 'Working together and protecting focused time may call for different ways of working. Consider when to collaborate and when to make space for individual work.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-learning-challenge',
    valueIds: ['34', '28'],
    valueTitles: ['LEARNING', 'CHALLENGE'],
    personal:
      'New challenges can create opportunities to learn. Consider which problems would help you develop a skill that matters to you.',
    team: 'New challenges can create opportunities to learn. Consider which problems would help you develop a skill that matters to you.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-creativity-variety',
    valueIds: ['35', '12'],
    valueTitles: ['CREATIVITY', 'VARIETY'],
    personal:
      'A variety of tasks can offer chances to think creatively. Consider where changing activities gives you room to try new ideas.',
    team: 'A variety of tasks can offer chances to think creatively. Consider where changing activities gives you room to try new ideas.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-helping-others-contact-with-people',
    valueIds: ['29', '14'],
    valueTitles: ['HELPING OTHERS', 'CONTACT WITH PEOPLE'],
    personal:
      'Contact with people can create opportunities to help. Consider which kinds of interaction let you offer support you value.',
    team: 'Contact with people can create opportunities to help. Consider which kinds of interaction let you offer support you value.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-independence-making-decisions',
    valueIds: ['31', '27'],
    valueTitles: ['INDEPENDENCE', 'MAKING DECISIONS'],
    personal:
      'Independence and making decisions can reinforce each other when you have ownership over how work gets done. Consider where that responsibility matters most to you.',
    team: 'Independence and making decisions can reinforce each other when you have ownership over how work gets done. Consider where that responsibility matters most to you.',
  },
  {
    exerciseType: 'personal',
    id: 'personal-being-expert-learning',
    valueIds: ['1', '34'],
    valueTitles: ['BEING EXPERT', 'LEARNING'],
    personal:
      'Learning can help you develop expertise. Consider what you would like to understand more deeply and how you might practise it.',
    team: 'Learning can help you develop expertise. Consider what you would like to understand more deeply and how you might practise it.',
  },
  {
    exerciseType: 'team',
    id: 'team-growth-humility',
    valueIds: ['5', '24'],
    valueTitles: ['GROWTH', 'HUMILITY'],
    personal:
      'Humility can help us recognise what we have yet to learn. Consider how we make it easier to ask for feedback and develop together.',
    team: 'Humility can help us recognise what we have yet to learn. Consider how we make it easier to ask for feedback and develop together.',
  },
  {
    exerciseType: 'team',
    id: 'team-trust-safety',
    valueIds: ['21', '18'],
    valueTitles: ['TRUST', 'SAFETY'],
    personal:
      'Trust and safety can reinforce each other when people can speak honestly and rely on a respectful response. Consider how we build both in everyday work.',
    team: 'Trust and safety can reinforce each other when people can speak honestly and rely on a respectful response. Consider how we build both in everyday work.',
  },
  {
    exerciseType: 'team',
    id: 'team-inclusivity-equity',
    valueIds: ['6', '35'],
    valueTitles: ['INCLUSIVITY', 'EQUITY'],
    personal:
      'Inclusivity and equity can support each other when different people can contribute and have fair opportunities. Consider whose needs or perspectives we might have missed.',
    team: 'Inclusivity and equity can support each other when different people can contribute and have fair opportunities. Consider whose needs or perspectives we might have missed.',
  },
  {
    exerciseType: 'team',
    id: 'team-creativity-innovation',
    valueIds: ['10', '23'],
    valueTitles: ['CREATIVITY', 'INNOVATION'],
    personal:
      'Creative thinking can help us find ideas to try, and innovation can put them into practice. Consider how we make space for both.',
    team: 'Creative thinking can help us find ideas to try, and innovation can put them into practice. Consider how we make space for both.',
  },
  {
    exerciseType: 'team',
    id: 'team-support-teamwork',
    valueIds: ['19', '2'],
    valueTitles: ['SUPPORT', 'TEAMWORK'],
    personal:
      'Practical support can make teamwork stronger. Consider how we notice when someone needs help and share it across the team.',
    team: 'Practical support can make teamwork stronger. Consider how we notice when someone needs help and share it across the team.',
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
    description: 'We aim for high standards in our work and look for ways to improve it.',
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

// Saved exercises retain the descriptions from when their cards were created.
function matchesCatalogueCard(exerciseType: ExerciseType, value: ValueCard): boolean {
  const card = (exerciseType === 'team' ? teamCards : personalCards).get(value.id);
  if (!card || card.title !== value.title) return false;
  const legacyDescription = (legacyTeamDescriptions as Record<string, string>)[value.id];
  return value.description === card.description || (exerciseType === 'team' && value.description === legacyDescription);
}

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
        matchesCatalogueCard(exerciseType, value)
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
  const match = curatedValues.find(
    (candidate) =>
      candidate.exerciseType === exerciseType &&
      candidate.valueId === value.id &&
      candidate.title === value.title &&
      matchesCatalogueCard(exerciseType, value)
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
