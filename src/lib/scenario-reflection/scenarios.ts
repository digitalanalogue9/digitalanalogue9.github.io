export type ReflectionPossibility = {
  id: string;
  intention: string;
  perception: string;
  question: string;
};

export type ScenarioResponse = {
  id: string;
  label: string;
  possibilities: ReflectionPossibility[];
};

export type BehaviourScenario = {
  id: string;
  prompt: string;
  context: string;
  responses: ScenarioResponse[];
};

export const BEHAVIOUR_CONTENT_VERSION = '1.0.0';

export const behaviourScenarios: BehaviourScenario[] = [
  {
    id: 'uncertain-estimate',
    prompt:
      'A colleague asks you to estimate when an unfamiliar piece of work will be ready. What would you most likely do?',
    context: 'You know some of the dependencies, but a few important details are still unclear.',
    responses: [
      {
        id: 'share-range',
        label: 'Share a range and explain what could move it.',
        possibilities: [
          {
            id: 'share-range-open',
            intention: 'You may want to be useful while making uncertainty visible.',
            perception: 'Someone could value the candour; someone else might want a firmer commitment.',
            question: 'What impression do you form when a range is offered, and what else could it mean?',
          },
        ],
      },
      {
        id: 'investigate-first',
        label: 'Ask questions and come back with a more grounded estimate.',
        possibilities: [
          {
            id: 'investigate-care',
            intention: 'You may want your estimate to be dependable.',
            perception: 'Someone could see care in checking; someone else may be waiting on a first indication.',
            question: 'What is within your control while the estimate is still uncertain?',
          },
        ],
      },
      {
        id: 'give-best-estimate',
        label: 'Give your best estimate now and flag that it may change.',
        possibilities: [
          {
            id: 'estimate-useful',
            intention: 'You may want the work to keep moving with the information available.',
            perception:
              'Someone could appreciate a starting point; someone else may remember the number more than the caveat.',
            question: 'What might help another person hear both the estimate and its uncertainty fairly?',
          },
        ],
      },
    ],
  },
  {
    id: 'disagreement-meeting',
    prompt:
      'In a meeting, a proposal is moving ahead and you see a drawback that has not been discussed. What would you most likely do?',
    context: 'The group is close to a decision, and people have already put effort into the proposal.',
    responses: [
      {
        id: 'raise-concern',
        label: 'Raise the drawback and ask how the group might address it.',
        possibilities: [
          {
            id: 'raise-fairness',
            intention: 'You may want the decision to account for a relevant concern.',
            perception: 'Someone could welcome another view; someone else may feel their work is being challenged.',
            question: 'How can you notice your first impression and still give the proposal a fair hearing?',
          },
        ],
      },
      {
        id: 'ask-after',
        label: 'Ask the proposer privately about the drawback after the meeting.',
        possibilities: [
          {
            id: 'private-care',
            intention: 'You may want to discuss the concern without putting someone on the spot.',
            perception:
              'Someone could value the care; someone else might wonder why the point was not raised with the group.',
            question: 'What can you influence about the way a concern is raised?',
          },
        ],
      },
      {
        id: 'support-decision',
        label: 'Support the decision for now and revisit the drawback if it becomes relevant.',
        possibilities: [
          {
            id: 'support-trust',
            intention: 'You may want to preserve momentum or trust the group’s judgement.',
            perception: 'Someone could experience support; someone else may miss information you had noticed.',
            question: 'What would help you judge whether waiting is a fair choice here?',
          },
        ],
      },
    ],
  },
  {
    id: 'deadline-conflict',
    prompt:
      'Two pieces of work are both due soon, and you cannot give each your full attention at the same time. What would you most likely do?',
    context: 'Both requests matter, and it is not yet clear whether either deadline can move.',
    responses: [
      {
        id: 'surface-tradeoff',
        label: 'Tell the people involved about the conflict and ask them to agree a priority.',
        possibilities: [
          {
            id: 'surface-clear',
            intention: 'You may want to make the trade-off visible and share the decision.',
            perception: 'Someone could see clear coordination; someone else may prefer you to recommend a priority.',
            question: 'Which parts of this situation can you decide, and which can you only influence?',
          },
        ],
      },
      {
        id: 'choose-priority',
        label: 'Choose the work with the greater immediate consequence and let others know.',
        possibilities: [
          {
            id: 'choose-judgment',
            intention: 'You may want to respond to the most pressing need.',
            perception:
              'Someone could appreciate your judgement; someone else may have a different view of the consequences.',
            question: 'What assumptions are shaping your sense of urgency?',
          },
        ],
      },
      {
        id: 'protect-quality',
        label: 'Explain what can be completed well and propose a realistic adjustment.',
        possibilities: [
          {
            id: 'quality-honest',
            intention: 'You may want the work to be useful and sustainable.',
            perception: 'Someone could value an honest plan; someone else may feel pressure about the timing.',
            question: 'How might you acknowledge both quality and the impact of delay?',
          },
        ],
      },
    ],
  },
  {
    id: 'shared-task-ownership',
    prompt:
      'A shared task has stalled because it is unclear who will take the next step. What would you most likely do?',
    context: 'You have capacity to help, though the task was not originally yours to lead.',
    responses: [
      {
        id: 'volunteer-next-step',
        label: 'Offer to take one clear next step and name what you will need from others.',
        possibilities: [
          {
            id: 'volunteer-helpful',
            intention: 'You may want to restore momentum and make ownership clearer.',
            perception: 'Someone could feel supported; someone else may see you taking over part of the work.',
            question: 'How could you check what help is welcome while still making progress?',
          },
        ],
      },
      {
        id: 'clarify-owner',
        label: 'Ask the group to agree who owns the next step.',
        possibilities: [
          {
            id: 'clarify-shared',
            intention: 'You may want responsibility to be shared explicitly.',
            perception:
              'Someone could appreciate the clarity; someone else may feel the conversation is slowing things down.',
            question: 'What is within your influence if the group has not agreed an owner yet?',
          },
        ],
      },
      {
        id: 'complete-task',
        label: 'Finish the task yourself if it is quicker, then update the group.',
        possibilities: [
          {
            id: 'finish-reliable',
            intention: 'You may want to make sure the work gets done.',
            perception: 'Someone could see reliability; someone else may not know how to contribute next time.',
            question: 'What impression might completing the task leave, and what remains uncertain?',
          },
        ],
      },
    ],
  },
  {
    id: 'colleague-support',
    prompt:
      'A colleague tells you they are having difficulty with a demanding piece of work. What would you most likely do?',
    context: 'They have not yet said whether they want advice, practical help, or simply time to talk.',
    responses: [
      {
        id: 'ask-what-helps',
        label: 'Ask what kind of support would help them most right now.',
        possibilities: [
          {
            id: 'ask-respect',
            intention: 'You may want to offer support that fits their needs.',
            perception: 'Someone could feel heard; someone else may not know what to ask for yet.',
            question: 'How can you stay open to what the other person says they need?',
          },
        ],
      },
      {
        id: 'offer-options',
        label: 'Offer a couple of specific ways you could help.',
        possibilities: [
          {
            id: 'options-practical',
            intention: 'You may want to make support concrete and easier to accept.',
            perception:
              'Someone could find the options useful; someone else may feel they are expected to choose quickly.',
            question: 'What helps an offer feel like an invitation rather than an expectation?',
          },
        ],
      },
      {
        id: 'listen-first',
        label: 'Make time to listen before suggesting any next steps.',
        possibilities: [
          {
            id: 'listen-present',
            intention: 'You may want to understand their experience before responding.',
            perception: 'Someone could value being heard; someone else may be hoping for practical help sooner.',
            question: 'What can you notice about your own urge to solve the problem?',
          },
        ],
      },
    ],
  },
  {
    id: 'feedback-response',
    prompt:
      'You receive feedback about a piece of work that differs from how you thought it had gone. What would you most likely do first?',
    context: 'The feedback is brief, and you are not yet sure what examples or expectations it refers to.',
    responses: [
      {
        id: 'seek-example',
        label: 'Ask for an example so you can understand the feedback more clearly.',
        possibilities: [
          {
            id: 'example-curious',
            intention: 'You may want to understand the specific experience behind the feedback.',
            perception: 'Someone could see curiosity; someone else might hear a challenge to their view.',
            question: 'What impression do you form as you hear feedback, and what evidence would help you examine it?',
          },
        ],
      },
      {
        id: 'reflect-before-reply',
        label: 'Take some time to reflect before responding.',
        possibilities: [
          {
            id: 'pause-thoughtful',
            intention: 'You may want to consider the feedback before deciding what to say.',
            perception: 'Someone could see thoughtfulness; someone else may be unsure whether you heard them.',
            question: 'How might you acknowledge what you heard while taking time to consider it?',
          },
        ],
      },
      {
        id: 'share-perspective',
        label: 'Explain your perspective and ask where your views differ.',
        possibilities: [
          {
            id: 'share-context',
            intention: 'You may want both perspectives to be understood.',
            perception:
              'Someone could appreciate the context; someone else may feel their feedback was not yet received.',
            question: 'What would a fair hearing of both accounts look like here?',
          },
        ],
      },
    ],
  },
];
