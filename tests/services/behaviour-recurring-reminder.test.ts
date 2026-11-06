import { BehaviourAttemptService, InMemoryBehaviourAttemptRepository } from '@/lib/services/behaviourAttemptService';
import { createDefaultBehaviourReminderSettings } from '@/lib/domain/behaviourReminder';

describe('BehaviourAttemptService recurring reminders', () => {
  async function finishedAttempt(service: BehaviourAttemptService) {
    const attempt = await service.startAttempt();
    await service.answer(attempt.id, attempt.scenarios[0].id, attempt.scenarios[0].responses[0].id);
    await service.finishAttempt(attempt.id);
    return service.loadAttempt(attempt.id);
  }

  it('persists explicit reminder choices and composes a self-contained fresh prompt from them', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await finishedAttempt(service);
    const selected = attempt.scenarios[0].reveals![0];
    const settings = createDefaultBehaviourReminderSettings('Europe/London');
    settings.schedule = { cadence: 'weekly', weekday: 4, time: '18:45', timezone: 'Europe/London' };
    settings.selectedPossibilityIds = [`${attempt.scenarios[0].id}:${selected.id}`];
    await service.updateReminderSettings(attempt.id, settings);

    const saved = await service.loadAttempt(attempt.id);
    expect(saved.reminderSettings).toEqual(settings);
    const prompt = await service.composeRecurringPrompt(attempt.id, new Date('2026-03-01T23:30:00.000Z'));
    expect(prompt).toContain('weekly');
    expect(prompt).toContain('18:45');
    expect(prompt).toContain('Europe/London');
    expect(prompt).toContain('Thursday');
    expect(prompt).toContain(selected.perception);
    expect(prompt).toContain('hypothetical');
    expect(prompt).toContain('Stoic');
    expect(prompt).toContain('fresh');
    expect(prompt).toContain(
      'Each run, determine the actual current calendar date in the selected time zone and use that date as a variation seed.'
    );
    expect(prompt).not.toContain('2026-03-02');
    expect(prompt).not.toContain(attempt.id);
    expect(prompt).not.toContain('09:00');
  });

  it('requires at least one explicit possibility and does not treat reflection responses as consent', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await finishedAttempt(service);
    const possibility = attempt.scenarios[0].reveals![0];
    await service.updateReflection(
      attempt.id,
      attempt.scenarios[0].id,
      possibility.id,
      'worth-considering',
      'private reflection'
    );
    await service.updateReminderSettings(attempt.id, createDefaultBehaviourReminderSettings('Europe/London'));

    await expect(service.composeRecurringPrompt(attempt.id)).rejects.toThrow(
      'Choose at least one reflection possibility'
    );
  });

  it('rejects active attempts, malformed timezones and possibilities that were not revealed', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const active = await service.startAttempt();
    await expect(service.updateReminderSettings(active.id, createDefaultBehaviourReminderSettings())).rejects.toThrow(
      'finished'
    );

    const finished = await finishedAttempt(service);
    const invalidZone = createDefaultBehaviourReminderSettings('Not/AZone');
    await expect(service.updateReminderSettings(finished.id, invalidZone)).rejects.toThrow('time zone');
    const invalidTime = createDefaultBehaviourReminderSettings();
    invalidTime.schedule.time = '27:90';
    await expect(service.updateReminderSettings(finished.id, invalidTime)).rejects.toThrow('time');
    const invalidDay = createDefaultBehaviourReminderSettings();
    invalidDay.schedule.weekday = 8;
    await expect(service.updateReminderSettings(finished.id, invalidDay)).rejects.toThrow('day');
    const unknown = createDefaultBehaviourReminderSettings();
    unknown.selectedPossibilityIds = ['scenario-unknown:possibility-unknown'];
    await expect(service.updateReminderSettings(finished.id, unknown)).rejects.toThrow('possibility');
    const futureSettings = { ...createDefaultBehaviourReminderSettings(), madeUpFlag: true };
    await expect(service.updateReminderSettings(finished.id, futureSettings as never)).rejects.toThrow('unsupported');
  });

  it('includes ticket 07 value context only after separate recurring export consent', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await finishedAttempt(service);
    const scenario = attempt.scenarios[0];
    const possibility = scenario.reveals![0];
    await service.setValuesConnection(attempt.id, {
      state: 'connected',
      scenarioId: scenario.id,
      possibilityId: possibility.id,
      sourceSessionId: 'saved-value-session',
      sourceExerciseType: 'personal',
      completedSession: {
        version: 2,
        sessionId: 'saved-value-session',
        completedAt: 50,
        finalValues: [{ id: 'care', title: 'Care', description: 'Make room for different views.' }],
      },
      valueId: 'care',
      observation: 'My optional observation.',
    });
    const settings = createDefaultBehaviourReminderSettings('Europe/London');
    settings.selectedPossibilityIds = [`${scenario.id}:${possibility.id}`];
    await service.updateReminderSettings(attempt.id, settings);
    const withoutConsent = await service.composeRecurringPrompt(attempt.id);
    expect(withoutConsent).not.toContain('Care — Make room for different views.');
    expect(withoutConsent).not.toContain('My optional observation.');

    settings.includeValuesConnections = true;
    await service.updateReminderSettings(attempt.id, settings);
    const publicConnection = await service.composeRecurringPrompt(attempt.id);
    expect(publicConnection).toContain('Care — Make room for different views.');
    expect(publicConnection).not.toContain('My optional observation.');

    settings.includeConnectionObservations = true;
    await service.updateReminderSettings(attempt.id, settings);
    expect(await service.composeRecurringPrompt(attempt.id)).toContain('My optional observation.');
  });

  it('round-trips supported reminder settings through backup without storing prompt or task state', async () => {
    const service = new BehaviourAttemptService(new InMemoryBehaviourAttemptRepository());
    const attempt = await finishedAttempt(service);
    const possibility = attempt.scenarios[0].reveals![0];
    const settings = createDefaultBehaviourReminderSettings('Europe/London');
    settings.selectedPossibilityIds = [`${attempt.scenarios[0].id}:${possibility.id}`];
    await service.updateReminderSettings(attempt.id, settings);
    await service.composeRecurringPrompt(attempt.id);
    const backup = await service.exportAttempt(attempt.id);

    expect(JSON.stringify(backup)).not.toContain('Create a short reflection');
    expect(JSON.stringify(backup)).not.toContain('externalTask');
    await service.deleteAttempt(attempt.id);
    const restored = await service.restoreAttempt(backup);
    expect(restored.reminderSettings).toEqual(settings);

    const malformed = structuredClone(backup);
    (malformed.attempt as Record<string, unknown>).reminderSettings = {
      ...settings,
      schedule: { ...settings.schedule, timezone: 'Not/AZone' },
    };
    await expect(service.restoreAttempt(malformed)).rejects.toThrow('time zone');
  });
});
