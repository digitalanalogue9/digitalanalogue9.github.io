import { useState } from 'react';
import type { ReflectionReminder } from '../../../lib/scenario-reflection/attemptStorage';
import {
  composeOneOffReflectionPrompt,
  composeRecurringReflectionPrompt,
  createDefaultReflectionReminder,
  isValidReminder,
} from '../../../lib/scenario-reflection/reflectionTools';
import type { ScenarioViewProps } from './types';

export function ScenarioPromptTools({
  attempt,
  updateAttempt,
  saveError,
  selectedPromptIds,
}: ScenarioViewProps & { selectedPromptIds: string[] }) {
  const [promptPreview, setPromptPreview] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [preferenceError, setPreferenceError] = useState(false);
  const [reminder, setReminder] = useState<ReflectionReminder>(
    () => attempt.reminder ?? createDefaultReflectionReminder()
  );
  return (
    <section aria-labelledby="reflection-prompts-heading" className="space-y-3 border-t pt-5">
      <h2 id="reflection-prompts-heading">Reflection prompts</h2>
      <p>
        Choose possibilities above to create a one-off prompt. Prompts are for consideration, not diagnosis or verified
        findings.
      </p>
      <button type="button" onClick={() => setPromptPreview(composeOneOffReflectionPrompt(attempt, selectedPromptIds))}>
        Create one-off prompt
      </button>
      <fieldset className="space-y-2 border-t pt-3">
        <legend>Recurring prompt preferences</legend>
        <p>
          This app does not schedule or send reminders. These saved preferences shape a prompt you can copy into another
          service.
        </p>
        <label>
          Cadence{' '}
          <select
            value={reminder.cadence}
            onChange={(event) =>
              setReminder({ ...reminder, cadence: event.target.value as ReflectionReminder['cadence'] })
            }
          >
            <option value="daily">Daily</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
        <label className="ml-3">
          Time{' '}
          <input
            type="time"
            value={reminder.time}
            onChange={(event) => setReminder({ ...reminder, time: event.target.value })}
          />
        </label>
        <label className="ml-3">
          Time zone{' '}
          <input
            value={reminder.timezone}
            onChange={(event) => setReminder({ ...reminder, timezone: event.target.value })}
          />
        </label>
        {reminder.cadence === 'weekly' && (
          <label className="ml-3">
            Day (1 Monday–7 Sunday){' '}
            <input
              type="number"
              min="1"
              max="7"
              value={reminder.weekday}
              onChange={(event) => setReminder({ ...reminder, weekday: Number(event.target.value) })}
            />
          </label>
        )}
        <button
          type="button"
          onClick={() => {
            const next = { ...reminder, selectedPossibilityIds: selectedPromptIds };
            if (!isValidReminder(next, attempt)) {
              setPreferenceError(true);
              return;
            }
            if (updateAttempt({ reminder: next })) {
              setReminder(next);
              setPreferenceError(false);
            }
          }}
        >
          Save reminder preferences
        </button>
        <button
          type="button"
          onClick={() => {
            const settings = attempt.reminder ?? { ...reminder, selectedPossibilityIds: selectedPromptIds };
            setPromptPreview(composeRecurringReflectionPrompt(attempt, settings));
          }}
        >
          Create recurring prompt
        </button>
      </fieldset>
      {(saveError || preferenceError) && (
        <p role="alert">Reminder preferences could not be saved. Check the time and time zone.</p>
      )}
      {promptPreview && (
        <label className="block">
          Prompt preview
          <textarea readOnly className="mt-1 block min-h-48 w-full border p-2" value={promptPreview} />
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard
                .writeText(promptPreview)
                .then(() => setCopyStatus('Prompt copied.'))
                .catch(() => setCopyStatus('Copy was unavailable. Select and copy the prompt text.'));
            }}
          >
            Copy prompt
          </button>
          {copyStatus && <span role="status">{copyStatus}</span>}
        </label>
      )}
    </section>
  );
}
