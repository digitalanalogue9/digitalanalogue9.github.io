import { useState } from 'react';

type ScheduleService = 'microsoft' | 'claude' | 'codex';

const scheduleServices: { id: ScheduleService; name: string }[] = [
  { id: 'microsoft', name: 'Copilot' },
  { id: 'claude', name: 'Claude' },
  { id: 'codex', name: 'ChatGPT' },
];

export function RecurringReflectionControls({
  recurringPrompt,
  onPromptChange,
  copyConfirmationCount = 0,
}: {
  recurringPrompt: string;
  onPromptChange: (value: string) => void;
  copyConfirmationCount?: number;
}) {
  const [selectedService, setSelectedService] = useState<ScheduleService | null>(null);

  return (
    <div className="w-full space-y-4">
      <section aria-labelledby="recurring-prompt-preview-heading" className="space-y-2">
        <label id="recurring-prompt-preview-heading" htmlFor="recurring-prompt" className="sr-only">
          Recurring prompt
        </label>
        <div className="relative">
          <textarea
            id="recurring-prompt"
            value={recurringPrompt}
            onChange={(event) => onPromptChange(event.target.value)}
            rows={14}
            className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-small text-sys-color-text-primary block w-full resize-y border p-4 leading-relaxed"
          />
          {copyConfirmationCount > 0 && (
            <span key={copyConfirmationCount} className="copy-prompt-flash" aria-hidden="true" />
          )}
        </div>
      </section>

      <div className="space-y-2 pt-1">
        <label htmlFor="recurring-reflection-service" className="sr-only">
          Setup instructions
        </label>
        <select
          id="recurring-reflection-service"
          value={selectedService ?? ''}
          onChange={(event) =>
            setSelectedService(scheduleServices.find((service) => service.id === event.target.value)?.id ?? null)
          }
          className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-small text-sys-color-text-primary focus-visible:outline-ref-color-brand-primary min-h-11 w-full max-w-sm border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <option value="">Show setup instructions for…</option>
          {scheduleServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <section
        aria-live="polite"
        className={selectedService ? 'space-y-3 border-t border-[var(--editorial-line)] pt-4' : ''}
      >
        {selectedService === 'microsoft' && (
          <>
            <h3 className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl">Copilot</h3>
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
            <h3 className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl">Claude</h3>
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
            <h3 className="page-section-heading text-sys-color-text-primary text-xl sm:text-2xl">ChatGPT</h3>
            <p className="text-interface-base-small text-sys-color-text-secondary leading-6">
              In ChatGPT, submit this prompt and ask it to run on a schedule. Confirm the timing when ChatGPT proposes
              it. You can manage your tasks in ChatGPT settings.{' '}
              <a
                href="https://help.openai.com/en/articles/10291617-tasks-in-chatgpt"
                target="_blank"
                rel="noreferrer"
                className="text-ref-color-brand-primary underline"
              >
                OpenAI guide to tasks in ChatGPT
              </a>
            </p>
          </>
        )}
      </section>
    </div>
  );
}
