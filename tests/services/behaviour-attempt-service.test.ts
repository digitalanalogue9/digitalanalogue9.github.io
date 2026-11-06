import {
  BehaviourAttemptService,
  InMemoryBehaviourAttemptRepository,
  type BehaviourAttempt,
} from '@/lib/services/behaviourAttemptService';
import { restoreBehaviourResultsEnvelope } from '@/lib/services/behaviourScenarioResults';

describe('BehaviourAttemptService', () => {
  test('rejects persisted scenario snapshots with invalid participant state', async () => {
    const repository = new InMemoryBehaviourAttemptRepository();
    const service = new BehaviourAttemptService(repository);
    const invalidContext = await service.startAttempt();
    const contextCopy = structuredClone(invalidContext);
    (contextCopy.scenarios[0] as unknown as { optionalContext: unknown }).optionalContext = 42;
    await repository.save(contextCopy);
    await expect(service.loadAttempt(invalidContext.id)).rejects.toThrow('scenario content is inconsistent');

    const invalidAnswer = await service.startAttempt();
    const answerCopy = structuredClone(invalidAnswer);
    (answerCopy.scenarios[0] as unknown as { answer: unknown }).answer = 'unrecognized-response';
    await repository.save(answerCopy);
    await expect(service.loadAttempt(invalidAnswer.id)).rejects.toThrow('scenario content is inconsistent');

    const activeReveal = await service.startAttempt();
    const revealCopy = structuredClone(activeReveal);
    revealCopy.scenarios[0].reveals = [];
    await repository.save(revealCopy);
    await expect(service.loadAttempt(activeReveal.id)).rejects.toThrow('scenario content is inconsistent');

    const invalidReflection = await service.startAttempt();
    const scenario = invalidReflection.scenarios[0];
    await service.answer(invalidReflection.id, scenario.id, scenario.responses[0].id);
    await service.finishAttempt(invalidReflection.id);
    const reflectionCopy = (await repository.read(invalidReflection.id)) as BehaviourAttempt;
    const possibilityId = reflectionCopy.scenarios[0].reveals![0].id;
    reflectionCopy.scenarios[0].reflections = {
      [possibilityId]: { response: 'unknown' as never },
    };
    await repository.save(reflectionCopy);
    await expect(service.loadAttempt(invalidReflection.id)).rejects.toThrow('scenario content is inconsistent');
  });

  test('rejects malformed persisted values connections and reminder settings', async () => {
    const repository = new InMemoryBehaviourAttemptRepository();
    const service = new BehaviourAttemptService(repository);
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id);
    await service.finishAttempt(attempt.id);
    await service.setValuesConnection(attempt.id, {
      state: 'connected',
      scenarioId: scenario.id,
      possibilityId: scenario.responses[0].possibilities[0].id,
      sourceSessionId: 'saved-values',
      sourceExerciseType: 'personal',
      completedSession: {
        version: 2,
        sessionId: 'saved-values',
        completedAt: 10,
        finalValues: [{ id: 'care', title: 'Care', description: 'Care for others.' }],
      },
      valueId: 'care',
    });
    const validAttempt = (await repository.read(attempt.id)) as BehaviourAttempt;
    const validConnection = validAttempt.valuesConnections![scenario.id];
    const expectInvalidConnection = async (connection: unknown) => {
      const changed = structuredClone(validAttempt);
      (changed.valuesConnections as unknown as Record<string, unknown>)[scenario.id] = connection;
      await repository.save(changed);
      await expect(service.loadAttempt(attempt.id)).rejects.toThrow(/Saved values connection/);
    };

    await expectInvalidConnection({ state: 'no-connection', scenarioId: scenario.id });
    await expectInvalidConnection({ ...validConnection, observation: 42 });
    await expectInvalidConnection({ ...validConnection, extra: true });

    const invalidReminderSettings = structuredClone(validAttempt);
    (invalidReminderSettings as unknown as { reminderSettings: unknown }).reminderSettings = {};
    await repository.save(invalidReminderSettings);
    await expect(service.loadAttempt(attempt.id)).rejects.toThrow('Saved reminder settings are invalid.');
  });

  test('exports active progress without serializing any unrevealed interpretation', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id, 'Private context');

    const backup = await service.exportAttempt(attempt.id, { includePrivateText: true, includeActiveProgress: true });
    const serialized = JSON.stringify(backup);

    expect(backup.format).toBe('core-values-scenario-results');
    expect(serialized).toContain('Private context');
    expect(serialized).not.toContain(scenario.responses[0].possibilities[0].intention);
    expect(serialized).not.toContain('possibilities');
  });

  test('exports private text only when explicitly requested and restores by replacing the same ID', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id, 'Private context');
    const backup = await service.exportAttempt(attempt.id, { includeActiveProgress: true });
    expect(JSON.stringify(backup)).not.toContain('Private context');

    const fullBackup = await service.exportAttempt(attempt.id, {
      includePrivateText: true,
      includeActiveProgress: true,
    });
    expect(JSON.stringify(fullBackup)).toContain('Private context');
    await service.updateContext(attempt.id, scenario.id, 'Newer local context');
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id);
    await service.finishAttempt(attempt.id);
    await service.updateReflection(
      attempt.id,
      scenario.id,
      scenario.responses[0].possibilities[0].id,
      'worth-considering',
      'Stale reflection'
    );
    await service.restoreAttempt(fullBackup);

    const restored = await service.loadAttempt(attempt.id);
    expect(restored.stage).toBe('active');
    expect(restored.scenarios[0].optionalContext).toBe('Private context');
    expect(restored.scenarios[0].reflections).toBeUndefined();
  });

  test('restores valid private reflections and rejects invalid reflection fields', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    const possibility = scenario.responses[0].possibilities[0];
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id);
    await service.finishAttempt(attempt.id);
    await service.updateReflection(attempt.id, scenario.id, possibility.id, 'not-sure', 'A private note.');
    const backup = await service.exportAttempt(attempt.id, { includePrivateText: true });

    expect(restoreBehaviourResultsEnvelope(backup).scenarios[0].reflections?.[possibility.id]).toEqual({
      response: 'not-sure',
      note: 'A private note.',
    });

    const invalidBackup = structuredClone(backup);
    const invalidAttempt = invalidBackup.attempt as {
      scenarios: Array<{ reflections?: Record<string, unknown> }>;
    };
    invalidAttempt.scenarios[0].reflections![possibility.id] = { response: 'not-sure', note: 42 };

    expect(() => restoreBehaviourResultsEnvelope(invalidBackup)).toThrow('invalid reflection response');
  });

  test('rejects unsupported and malformed scenario backups before changing stored attempts', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const backup = await service.exportAttempt(attempt.id, { includeActiveProgress: true });
    await expect(service.restoreAttempt({ ...backup, version: 2 })).rejects.toThrow();
    const invalidActive = structuredClone(backup);
    (invalidActive.attempt as { scenarios: Array<{ reveals?: unknown[] }> }).scenarios[0].reveals = [];
    await expect(service.restoreAttempt(invalidActive)).rejects.toThrow();
    await expect(
      service.restoreAttempt({ ...backup, attempt: { ...(backup.attempt as object), contentVersion: 'future' } })
    ).rejects.toThrow();
    const invalidReference = structuredClone(backup);
    (invalidReference.attempt as { scenarios: Array<{ id: string }> }).scenarios[0].id = 'unknown-situation';
    await expect(service.restoreAttempt(invalidReference)).rejects.toThrow();
    expect((await service.loadAttempt(attempt.id)).stage).toBe('active');
  });

  test('saves and reopens a deliberate public value snapshot, including explicit no-connection, without source notes', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const first = attempt.scenarios[0];
    await service.answer(attempt.id, first.id, first.responses[0].id);
    await service.finishAttempt(attempt.id);
    const linked = await service.setValuesConnection(attempt.id, {
      state: 'connected',
      scenarioId: first.id,
      possibilityId: first.responses[0].possibilities[0].id,
      sourceSessionId: 'completed-values-1',
      sourceExerciseType: 'team',
      completedSession: {
        version: 2,
        sessionId: 'completed-values-1',
        completedAt: 123,
        finalValues: [
          { id: 'value-a', title: 'Care', description: 'Make room for different views.', reason: 'PRIVATE REASON' },
        ],
      },
      valueId: 'value-a',
      observation: 'I chose this connection deliberately.',
    });
    expect(linked.valuesConnections?.[first.id]).toMatchObject({
      state: 'connected',
      sourceSessionId: 'completed-values-1',
      sourceExerciseType: 'team',
      value: { id: 'value-a', title: 'Care', description: 'Make room for different views.' },
      observation: 'I chose this connection deliberately.',
    });
    expect(JSON.stringify(linked.valuesConnections)).not.toContain('PRIVATE REASON');
    expect((await service.loadAttempt(attempt.id)).valuesConnections).toEqual(linked.valuesConnections);
    const unconnected = await service.setValuesConnection(attempt.id, { scenarioId: first.id, state: 'no-connection' });
    expect(unconnected.valuesConnections?.[first.id]).toEqual({ state: 'no-connection' });
    expect((await service.loadAttempt(attempt.id)).valuesConnections).toEqual({
      [first.id]: { state: 'no-connection' },
    });
  });

  test('scenario backup includes chosen connections only after explicit opt-in and restores public snapshots', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id);
    await service.finishAttempt(attempt.id);
    await service.setValuesConnection(attempt.id, {
      state: 'connected',
      scenarioId: scenario.id,
      possibilityId: scenario.responses[0].possibilities[0].id,
      sourceSessionId: 'saved-values',
      sourceExerciseType: 'personal',
      completedSession: {
        version: 2,
        sessionId: 'saved-values',
        completedAt: 11,
        finalValues: [{ id: 'care', title: 'Care', description: 'A public description.' }],
      },
      valueId: 'care',
      observation: 'private observation',
    });
    const ordinary = await service.exportAttempt(attempt.id);
    expect(JSON.stringify(ordinary)).not.toContain('saved-values');
    const publicBackup = await service.exportAttempt(attempt.id, { includeValuesConnections: true });
    expect(JSON.stringify(publicBackup)).toContain('A public description.');
    expect(JSON.stringify(publicBackup)).not.toContain('private observation');
    const fullBackup = await service.exportAttempt(attempt.id, {
      includeValuesConnections: true,
      includePrivateText: true,
    });
    expect(JSON.stringify(fullBackup)).toContain('private observation');
    await service.deleteAttempt(attempt.id);
    const restored = await service.restoreAttempt(publicBackup);
    expect(restored.valuesConnections?.[scenario.id]).toMatchObject({
      state: 'connected',
      sourceSessionId: 'saved-values',
      value: { title: 'Care', description: 'A public description.' },
    });
    expect(JSON.stringify(restored.valuesConnections)).not.toContain('private observation');
  });
  test('keeps possible interpretations hidden until explicit finish and reveals only the chosen response', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const first = attempt.scenarios[0];

    expect(attempt.stage).toBe('active');
    expect(attempt.scenarios).toHaveLength(6);
    expect(first.reveals).toBeUndefined();

    const answered = await service.answer(attempt.id, first.id, first.responses[0].id);
    expect(answered.scenarios[0].reveals).toBeUndefined();

    const finished = await service.finishAttempt(attempt.id);
    expect(finished.stage).toBe('finished');
    expect(finished.scenarios[0].reveals).toEqual(first.responses[0].possibilities);
    expect(finished.scenarios.slice(1).every((scenario) => scenario.reveals === undefined)).toBe(true);
  });

  test('all-skipped completion has no tailored perspectives and does not invent a generic profile', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    for (const scenario of attempt.scenarios) await service.answer(attempt.id, scenario.id, 'skip');
    const finished = await service.finishAttempt(attempt.id);

    expect(finished.scenarios.every((scenario) => scenario.reveals === undefined)).toBe(true);
    expect(finished.scenarios.every((scenario) => scenario.answer === 'skip')).toBe(true);
  });

  test('scenario and possibility identifiers are unique and every authored response has original possibilities', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenarioIds = attempt.scenarios.map((scenario) => scenario.id);
    const responseIds = attempt.scenarios.flatMap((scenario) =>
      scenario.responses.map((response) => `${scenario.id}:${response.id}`)
    );
    const possibilityIds = attempt.scenarios.flatMap((scenario) =>
      scenario.responses.flatMap((response) => response.possibilities.map((possibility) => possibility.id))
    );

    expect(new Set(scenarioIds).size).toBe(6);
    expect(new Set(responseIds).size).toBe(responseIds.length);
    expect(new Set(possibilityIds).size).toBe(possibilityIds.length);
    expect(
      attempt.scenarios.every(
        (scenario) =>
          scenario.responses.length >= 3 && scenario.responses.every((response) => response.possibilities.length > 0)
      )
    ).toBe(true);
  });

  test('depends, skipped and unanswered choices do not produce tailored reveals', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const [first, second] = attempt.scenarios;

    await service.answer(attempt.id, first.id, 'depends');
    await service.answer(attempt.id, second.id, 'skip');
    const finished = await service.finishAttempt(attempt.id);

    expect(finished.scenarios[0].reveals).toBeUndefined();
    expect(finished.scenarios[1].reveals).toBeUndefined();
    expect(finished.scenarios[2].answer).toBeUndefined();
    expect(finished.scenarios[2].reveals).toBeUndefined();
    expect(
      finished.scenarios.filter((scenario) => scenario.answer === 'skip' || scenario.answer === 'depends')
    ).toHaveLength(2);
  });

  test('allows answer edits before finishing and preserves optional context literally', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id, 'An exact note: maybe');
    const edited = await service.answer(attempt.id, scenario.id, scenario.responses[1].id, 'Still uncertain.');

    expect(edited.scenarios[0].answer).toBe(scenario.responses[1].id);
    expect(edited.scenarios[0].optionalContext).toBe('Still uncertain.');
    expect(edited.scenarios[0].reveals).toBeUndefined();
  });

  test('stores optional context without changing an unanswered state', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const updated = await service.updateContext(attempt.id, attempt.scenarios[0].id, 'It depends on the team.');

    expect(updated.scenarios[0].answer).toBeUndefined();
    expect(updated.scenarios[0].optionalContext).toBe('It depends on the team.');
  });

  test('keeps optional context when the participant later edits their answer', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    await service.updateContext(attempt.id, scenario.id, 'A literal note');
    const updated = await service.answer(attempt.id, scenario.id, scenario.responses[1].id);

    expect(updated.scenarios[0].optionalContext).toBe('A literal note');
  });

  test('saves distinct reflection responses and literal notes for a finished possibility, including clearing a response', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const scenario = attempt.scenarios[0];
    const possibility = scenario.responses[0].possibilities[0];
    await service.answer(attempt.id, scenario.id, scenario.responses[0].id);
    await service.finishAttempt(attempt.id);

    await service.updateReflection(
      attempt.id,
      scenario.id,
      possibility.id,
      'worth-considering',
      'Literal note: maybe.'
    );
    const reopened = await service.loadAttempt(attempt.id);
    expect(reopened.scenarios[0].reflections?.[possibility.id]).toEqual({
      response: 'worth-considering',
      note: 'Literal note: maybe.',
    });

    await service.updateReflection(attempt.id, scenario.id, possibility.id, 'does-not-fit', 'Literal note: maybe.');
    await service.updateReflection(attempt.id, scenario.id, possibility.id, 'not-sure', '');
    await service.updateReflection(attempt.id, scenario.id, possibility.id, undefined, '');
    const cleared = await service.loadAttempt(attempt.id);
    expect(cleared.scenarios[0].reflections?.[possibility.id]).toBeUndefined();
  });

  test('rejects invalid or premature reflections and never reflects on depends, skipped or unanswered situations', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await service.startAttempt();
    const [first, second, third] = attempt.scenarios;
    const possibility = first.responses[0].possibilities[0];

    await expect(
      service.updateReflection(attempt.id, first.id, possibility.id, 'worth-considering', '')
    ).rejects.toThrow('Finished scenario reflections');
    await service.answer(attempt.id, first.id, first.responses[0].id);
    await service.answer(attempt.id, second.id, 'depends');
    await service.answer(attempt.id, third.id, 'skip');
    await service.finishAttempt(attempt.id);
    await expect(
      service.updateReflection(attempt.id, second.id, possibility.id, 'worth-considering', '')
    ).rejects.toThrow('not part of this scenario');
    await expect(
      service.updateReflection(attempt.id, first.id, 'invented-possibility', 'not-sure', '')
    ).rejects.toThrow('not part of this scenario');
    await expect(
      service.updateReflection(attempt.id, first.id, possibility.id, 'unrecognized' as never, '')
    ).rejects.toThrow('Invalid reflection response');
    const finished = await service.loadAttempt(attempt.id);
    expect(finished.scenarios[0].reflections).toBeUndefined();
    expect(finished.scenarios.slice(1).every((item) => item.reflections === undefined)).toBe(true);
  });
});

test('persists the current situation and supports listing and deleting independent attempts', async () => {
  const repository = new InMemoryBehaviourAttemptRepository();
  const service = new BehaviourAttemptService(repository);
  const first = await service.startAttempt();
  const second = await service.startAttempt();

  await service.setPosition(first.id, 3);
  expect((await service.loadAttempt(first.id)).position).toBe(3);
  expect(await service.listAttempts()).toHaveLength(2);
  await service.deleteAttempt(first.id);
  expect(await service.listAttempts()).toHaveLength(1);
  await expect(service.loadAttempt(first.id)).rejects.toThrow('Scenario attempt not found.');
  expect((await service.loadAttempt(second.id)).id).toBe(second.id);
});

test('orders overlapping saves so an older delayed edit cannot replace a newer one', async () => {
  let releaseFirst!: () => void;
  let enteredFirst!: () => void;
  const firstWriteEntered = new Promise<void>((resolve) => {
    enteredFirst = resolve;
  });
  const firstWriteGate = new Promise<void>((resolve) => {
    releaseFirst = resolve;
  });
  class DelayedRepository extends InMemoryBehaviourAttemptRepository {
    private writes = 0;
    override async save(attempt: import('@/lib/services/behaviourAttemptService').BehaviourAttempt): Promise<void> {
      this.writes += 1;
      if (this.writes === 1) {
        enteredFirst();
        await firstWriteGate;
      }
      await super.save(attempt);
    }
  }
  const service = new BehaviourAttemptService(new DelayedRepository());
  const attempt = await service.startAttempt();
  const scenarioId = attempt.scenarios[0].id;
  const older = service.updateContext(attempt.id, scenarioId, 'Earlier edit');
  await firstWriteEntered;
  const newer = service.updateContext(attempt.id, scenarioId, 'Later edit');
  releaseFirst();
  await Promise.all([older, newer]);
  expect((await service.loadAttempt(attempt.id)).scenarios[0].optionalContext).toBe('Later edit');
});
