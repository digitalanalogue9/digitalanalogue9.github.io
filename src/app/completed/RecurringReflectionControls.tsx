import type { Dispatch, SetStateAction } from 'react';
import type { SchedulePreferences, WeeklyDay } from '@/lib/contracts/types';
import type { OneOffCoachingContextOption } from '@/lib/content/oneOffCoachingPrompt';

const actionButtonClasses =
  'inline-flex min-h-11 items-center gap-2 rounded-sys-radius-button-sm border border-sys-color-border-strong px-4 py-2 text-interface-base-small font-semibold text-sys-color-text-primary transition-colors hover:bg-sys-color-surface-subtle disabled:opacity-60 md:min-h-9';
const weeklyDays: { value: WeeklyDay; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export function RecurringReflectionControls({
  recurringPromptExpanded,
  setRecurringPromptExpanded,
  schedulePreferences,
  updateSchedulePreferences,
  working,
  recurringContextOptions,
  includedRecurringContextIds,
  setIncludedRecurringContextIds,
  recurringPrompt,
  handleCopyRecurringPrompt,
  recurringCopyFeedback,
}: {
  recurringPromptExpanded: boolean;
  setRecurringPromptExpanded: Dispatch<SetStateAction<boolean>>;
  schedulePreferences: SchedulePreferences;
  updateSchedulePreferences: (next: SchedulePreferences) => void;
  working: boolean;
  recurringContextOptions: OneOffCoachingContextOption[];
  includedRecurringContextIds: string[];
  setIncludedRecurringContextIds: Dispatch<SetStateAction<string[]>>;
  recurringPrompt: string;
  handleCopyRecurringPrompt: () => void;
  recurringCopyFeedback: string | null;
}) {
  return (
    <>
      <button
        type="button"
        aria-expanded={recurringPromptExpanded}
        className={`${actionButtonClasses} order-1`}
        onClick={() => setRecurringPromptExpanded((expanded) => !expanded)}
      >
        Set up recurring reflection
      </button>
      {recurringPromptExpanded && (
        <div className="order-2 basis-full space-y-4 pt-3">
          <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
            Choose reminder preferences and review the prompt. Select Save reflection above to keep these preferences on
            this device. The app has not scheduled or sent anything. Confirm the time, timezone and cadence in the
            external service, and replace its saved prompt if your values or reflection context change.
          </p>
          <section className="space-y-3 border-t border-[var(--editorial-line)] pt-4">
            <h3 className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl">
              Microsoft 365 Copilot setup
            </h3>
            <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
              <span className="block">
                For the agent route, create an agent in Microsoft 365 Copilot and run it manually, usually with this
                prompt but not exclusively. After a result appears, use its menu to turn it into a recurring prompt,
                then choose the cadence, number of days and time. Available options can vary.
              </span>
              <span className="mt-2 block">
                Microsoft also documents direct scheduled prompts in Copilot Chat, Microsoft Copilot in Teams, and
                Outlook on the web and desktop. Where available, hover over your prompt and choose “Schedule this
                prompt”, choose when and how often it should run, and save it. A Microsoft Copilot licence is required,
                and account or administrator settings may affect availability. Check Copilot’s Scheduled prompts list to
                confirm it was saved. This app has not scheduled or sent anything.
              </span>{' '}
              <a
                href="https://support.microsoft.com/en-us/microsoft-365-copilot/schedule-your-most-used-copilot-prompts"
                target="_blank"
                rel="noreferrer"
                className="text-ref-color-brand-primary underline"
              >
                Microsoft guidance for scheduling Copilot prompts
              </a>
            </p>
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-interface-base-small text-sys-color-text-primary block font-semibold">
              Frequency
              <select
                aria-label="Recurring reflection frequency"
                className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default focus-visible:outline-ref-color-brand-primary mt-1 min-h-11 w-full border px-3 font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
                disabled={working}
                value={schedulePreferences.frequency}
                onChange={(event) => {
                  const frequency = event.target.value as SchedulePreferences['frequency'];
                  updateSchedulePreferences({
                    ...schedulePreferences,
                    frequency,
                    ...(frequency === 'weekly'
                      ? { weeklyDay: schedulePreferences.weeklyDay ?? 'monday' }
                      : { weeklyDay: undefined }),
                  });
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label className="text-interface-base-small text-sys-color-text-primary block font-semibold">
              Local time
              <input
                aria-label="Recurring reflection local time"
                type="time"
                className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default focus-visible:outline-ref-color-brand-primary mt-1 min-h-11 w-full border px-3 font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
                disabled={working}
                value={schedulePreferences.localTime}
                onChange={(event) =>
                  updateSchedulePreferences({ ...schedulePreferences, localTime: event.target.value })
                }
              />
            </label>
            <label className="text-interface-base-small text-sys-color-text-primary block font-semibold">
              Timezone
              <input
                aria-label="Recurring reflection timezone"
                type="text"
                className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default focus-visible:outline-ref-color-brand-primary mt-1 min-h-11 w-full border px-3 font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
                disabled={working}
                value={schedulePreferences.timeZone}
                onChange={(event) =>
                  updateSchedulePreferences({ ...schedulePreferences, timeZone: event.target.value })
                }
              />
            </label>
            {schedulePreferences.frequency === 'weekly' && (
              <label className="text-interface-base-small text-sys-color-text-primary block font-semibold">
                Day of the week
                <select
                  aria-label="Recurring reflection weekday"
                  className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default focus-visible:outline-ref-color-brand-primary mt-1 min-h-11 w-full border px-3 font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
                  disabled={working}
                  value={schedulePreferences.weeklyDay ?? 'monday'}
                  onChange={(event) =>
                    updateSchedulePreferences({
                      ...schedulePreferences,
                      weeklyDay: event.target.value as WeeklyDay,
                    })
                  }
                >
                  {weeklyDays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <fieldset className="space-y-2">
            <legend className="text-interface-base-small text-sys-color-text-primary mb-2 font-semibold">
              Optional context for this recurring prompt (all off by default)
            </legend>
            {recurringContextOptions.length === 0 ? (
              <p className="text-interface-base-small text-sys-color-text-secondary">
                There is no optional context to include yet.
              </p>
            ) : (
              recurringContextOptions.map((option) => (
                <label
                  key={option.id}
                  className="text-interface-base-small text-sys-color-text-primary flex min-h-11 items-start gap-2 py-2"
                >
                  <input
                    type="checkbox"
                    disabled={working}
                    checked={includedRecurringContextIds.includes(option.id)}
                    onChange={(event) =>
                      setIncludedRecurringContextIds((current) =>
                        event.target.checked ? [...current, option.id] : current.filter((id) => id !== option.id)
                      )
                    }
                  />
                  <span>
                    {option.label}: <span className="text-sys-color-text-secondary">{option.text}</span>
                  </span>
                </label>
              ))
            )}
          </fieldset>
          <section aria-labelledby="recurring-prompt-preview-heading" className="space-y-2">
            <h3
              id="recurring-prompt-preview-heading"
              className="text-interface-base-small text-sys-color-text-primary font-semibold"
            >
              Exact recurring prompt preview
            </h3>
            <pre className="rounded-sys-radius-button-sm border-sys-color-border-default bg-sys-color-surface-subtle text-interface-base-small text-sys-color-text-primary max-h-[32rem] overflow-auto border p-4 break-words whitespace-pre-wrap">
              {recurringPrompt}
            </pre>
            <button type="button" className={actionButtonClasses} onClick={() => void handleCopyRecurringPrompt()}>
              Copy preview
            </button>
            {recurringCopyFeedback && (
              <p className="text-interface-base-small text-sys-color-text-secondary" role="status">
                {recurringCopyFeedback}
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
