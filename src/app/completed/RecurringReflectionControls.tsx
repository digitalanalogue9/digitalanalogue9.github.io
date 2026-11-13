import { useState, type Dispatch, type SetStateAction } from 'react';
import type { OneOffCoachingContextOption } from '@/lib/content/oneOffCoachingPrompt';

const primaryActionButtonClasses = 'cv-button min-h-11 text-interface-base-small md:min-h-10';
const secondaryActionButtonClasses = `${primaryActionButtonClasses} cv-button--secondary`;

type ScheduleService = 'microsoft' | 'claude' | 'codex';

const scheduleServices: { id: ScheduleService; name: string }[] = [
  { id: 'microsoft', name: 'Microsoft 365 Copilot' },
  { id: 'claude', name: 'Claude Cowork' },
  { id: 'codex', name: 'Codex' },
];

export function RecurringReflectionControls({
  working,
  recurringContextOptions,
  includedRecurringContextIds,
  setIncludedRecurringContextIds,
  recurringPrompt,
  handleCopyRecurringPrompt,
  recurringCopyFeedback,
}: {
  working: boolean;
  recurringContextOptions: OneOffCoachingContextOption[];
  includedRecurringContextIds: string[];
  setIncludedRecurringContextIds: Dispatch<SetStateAction<string[]>>;
  recurringPrompt: string;
  handleCopyRecurringPrompt: () => void;
  recurringCopyFeedback: string | null;
}) {
  const [selectedService, setSelectedService] = useState<ScheduleService>('microsoft');

  return (
    <div className="w-full space-y-4 pt-3">
      <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
        Copy this prompt into your chosen service and follow its steps to schedule it. This app creates the prompt but
        does not schedule or send it.
      </p>

      <fieldset className="space-y-2 border-t border-[var(--editorial-line)] pt-4">
        <legend className="text-interface-base-small text-sys-color-text-primary mb-2 font-semibold">
          Schedule with
        </legend>
        <div className="flex flex-wrap gap-2">
          {scheduleServices.map((service) => (
            <label
              key={service.id}
              className={`text-interface-base-small rounded-sys-radius-button-sm flex min-h-11 cursor-pointer items-center gap-2 border px-3 py-2 ${
                selectedService === service.id
                  ? 'border-sys-color-border-strong bg-sys-color-surface-subtle font-semibold'
                  : 'border-sys-color-border-default text-sys-color-text-secondary'
              }`}
            >
              <input
                type="radio"
                name="recurring-reflection-service"
                value={service.id}
                checked={selectedService === service.id}
                onChange={() => setSelectedService(service.id)}
                className="accent-ref-color-brand-primary"
              />
              {service.name}
            </label>
          ))}
        </div>
      </fieldset>

      <section aria-live="polite" className="space-y-3 border-t border-[var(--editorial-line)] pt-4">
        {selectedService === 'microsoft' && (
          <>
            <h3 className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl">
              Microsoft 365 Copilot Chat
            </h3>
            <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
              Microsoft calls these Scheduled tasks. In Copilot Chat, submit this prompt, choose “Schedule this”, set
              when and how often it should run, then save it. Manage your tasks in Task Hub under Scheduled. A Microsoft
              365 Copilot licence is required, and availability may vary by account.{' '}
              <a
                href="https://support.microsoft.com/en-us/microsoft-365-copilot/schedule-your-most-used-copilot-prompts"
                target="_blank"
                rel="noreferrer"
                className="text-ref-color-brand-primary underline"
              >
                Microsoft guide to scheduled tasks in Copilot Chat
              </a>
            </p>
          </>
        )}
        {selectedService === 'claude' && (
          <>
            <h3 className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl">Claude Cowork</h3>
            <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
              Open Scheduled, choose New task, then Create with Claude. Give Claude this prompt and the cadence you
              want. Review the task details and schedule before confirming. You can review, edit, pause, or run it from
              Scheduled. Availability depends on your plan and workspace settings.{' '}
              <a
                href="https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork"
                target="_blank"
                rel="noreferrer"
                className="text-ref-color-brand-primary underline"
              >
                Claude guide to scheduled tasks
              </a>
            </p>
          </>
        )}
        {selectedService === 'codex' && (
          <>
            <h3 className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl">Codex</h3>
            <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
              In a Codex chat, ask it to run this prompt on a schedule. Choose whether each run should return to this
              chat or start a new one, then review it under Scheduled. Tasks that use a local project need the ChatGPT
              desktop app and computer running.{' '}
              <a
                href="https://developers.openai.com/codex/app/automations"
                target="_blank"
                rel="noreferrer"
                className="text-ref-color-brand-primary underline"
              >
                Official OpenAI documentation for Codex scheduled tasks
              </a>
            </p>
          </>
        )}
      </section>

      <details className="border-t border-[var(--editorial-line)] pt-4">
        <summary className="text-interface-base-small text-sys-color-text-primary min-h-11 cursor-pointer py-2 font-semibold">
          Optional context for this recurring prompt
          {includedRecurringContextIds.length > 0 && ` (${includedRecurringContextIds.length} selected)`}
        </summary>
        <fieldset className="space-y-2 pt-2">
          <legend className="sr-only">Choose optional context to include</legend>
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
      </details>

      <section
        aria-labelledby="recurring-prompt-preview-heading"
        className="space-y-2 border-t border-[var(--editorial-line)] pt-4"
      >
        <h3
          id="recurring-prompt-preview-heading"
          className="text-interface-base-small text-sys-color-text-primary font-semibold"
        >
          Recurring prompt
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={secondaryActionButtonClasses}
            onClick={() => void handleCopyRecurringPrompt()}
          >
            Copy prompt
          </button>
          <details>
            <summary className="text-interface-base-small text-ref-color-brand-primary min-h-11 cursor-pointer py-2 underline">
              Review full prompt
            </summary>
            <pre className="rounded-sys-radius-button-sm border-sys-color-border-default bg-sys-color-surface-subtle text-interface-base-small text-sys-color-text-primary mt-2 max-h-[32rem] overflow-auto border p-4 break-words whitespace-pre-wrap">
              {recurringPrompt}
            </pre>
          </details>
        </div>
        {recurringCopyFeedback && (
          <p className="text-interface-base-small text-sys-color-text-secondary" role="status">
            {recurringCopyFeedback}
          </p>
        )}
      </section>
    </div>
  );
}
