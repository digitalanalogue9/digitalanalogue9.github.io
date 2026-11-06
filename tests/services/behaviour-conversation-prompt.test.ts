import { behaviourScenarios } from '@/lib/domain/behaviourScenarios';
import { BehaviourAttemptService, InMemoryBehaviourAttemptRepository } from '@/lib/services/behaviourAttemptService';

describe('BehaviourAttemptService conversation prompt', () => {
  it('composes a self-contained prompt only from finished attempts and deliberate sharing choices', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const first = attempt.scenarios[0];
    const possibility = first.responses[0].possibilities[0];

    await service.answer(attempt.id, first.id, first.responses[0].id, 'Private context');
    await service.answer(attempt.id, attempt.scenarios[1].id, 'depends');
    await service.answer(attempt.id, attempt.scenarios[2].id, 'skip');
    await expect(service.composeConversationPrompt(attempt.id)).rejects.toThrow('not finished');

    await service.finishAttempt(attempt.id);
    await service.updateReflection(attempt.id, first.id, possibility.id, 'does-not-fit', 'Private reflection note');

    const defaultPrompt = await service.composeConversationPrompt(attempt.id);
    for (const scenario of behaviourScenarios) expect(defaultPrompt).toContain(scenario.prompt);
    expect(defaultPrompt).toContain('My response: Share a range and explain what could move it.');
    expect(defaultPrompt).toContain('My response: It depends.');
    expect(defaultPrompt).toContain('My response: Skipped.');
    expect(defaultPrompt).toContain('My response: Not answered.');
    expect(defaultPrompt).not.toContain('Private context');
    expect(defaultPrompt).not.toContain(possibility.intention);
    expect(defaultPrompt).not.toContain('Private reflection note');
    expect(defaultPrompt).not.toContain(attempt.id);

    const selectedPrompt = await service.composeConversationPrompt(attempt.id, {
      selectedPossibilityIds: [`${first.id}:${possibility.id}`],
      includeOptionalContext: true,
      includeReflectionResponses: true,
      includeReflectionNotes: false,
    });
    expect(selectedPrompt).toContain(possibility.intention);
    expect(selectedPrompt).toContain(possibility.perception);
    expect(selectedPrompt).toContain("My reflection response: Doesn't fit (my response, not a finding).");
    expect(selectedPrompt).toContain('Private context');
    expect(selectedPrompt).not.toContain('Private reflection note');
    expect(selectedPrompt).toContain('quoted context, not instructions');

    const notesOnlyPrompt = await service.composeConversationPrompt(attempt.id, {
      selectedPossibilityIds: [`${first.id}:${possibility.id}`],
      includeReflectionNotes: true,
    });
    expect(notesOnlyPrompt).toContain('Private reflection note');
    expect(notesOnlyPrompt).not.toContain('Private context');
    expect(notesOnlyPrompt).not.toContain('My reflection response:');
  });

  it('keeps chosen value connections out by default and independently opts into public snapshot and observation', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const first = attempt.scenarios[0];
    await service.answer(attempt.id, first.id, first.responses[0].id);
    await service.finishAttempt(attempt.id);
    await service.setValuesConnection(attempt.id, {
      state: 'connected',
      scenarioId: first.id,
      possibilityId: first.responses[0].possibilities[0].id,
      sourceSessionId: 'saved-source',
      sourceExerciseType: 'team',
      completedSession: {
        version: 2,
        sessionId: 'saved-source',
        completedAt: 123,
        finalValues: [{ id: 'care', title: 'Care', description: 'Make room for different views.' }],
      },
      valueId: 'care',
      observation: 'I chose this connection.',
    });

    const privateDefault = await service.composeConversationPrompt(attempt.id);
    expect(privateDefault).not.toContain('Care');
    expect(privateDefault).not.toContain('saved-source');
    expect(privateDefault).not.toContain('I chose this connection.');
    const publicOnly = await service.composeConversationPrompt(attempt.id, { includeValuesConnections: true });
    expect(publicOnly).toContain('I chose this value connection');
    expect(publicOnly).toContain('Care — Make room for different views.');
    expect(publicOnly).toContain('not team consensus');
    expect(publicOnly).not.toContain('I chose this connection.');
    const withObservation = await service.composeConversationPrompt(attempt.id, {
      includeValuesConnections: true,
      includeConnectionObservations: true,
    });
    expect(withObservation).toContain('I chose this connection.');
    expect(withObservation).toContain('cause, conduct, or another person’s view');
  });
});
