import { useState } from 'react';

type ScheduleService = 'microsoft' | 'claude' | 'codex';

const scheduleServices: { id: ScheduleService; name: string }[] = [
  { id: 'microsoft', name: 'Microsoft 365 Copilot' },
  { id: 'claude', name: 'Claude Cowork' },
  { id: 'codex', name: 'Codex' },
];

export function RecurringReflectionControls({
  recurringPrompt,
  onPromptChange,
}: {
  recurringPrompt: string;
  onPromptChange: (value: string) => void;
}) {
  const [selectedService, setSelectedService] = useState<ScheduleService>('microsoft');

  return (
    <div className="w-full space-y-4 pt-3">
      <section aria-labelledby="recurring-prompt-preview-heading" className="space-y-2">
        <label id="recurring-prompt-preview-heading" htmlFor="recurring-prompt" className="sr-only">
          Recurring prompt
        </label>
        <textarea
          id="recurring-prompt"
          value={recurringPrompt}
          onChange={(event) => onPromptChange(event.target.value)}
          rows={14}
          className="rounded-sys-radius-button-sm border-sys-color-border-strong bg-sys-color-surface-default text-interface-base-small text-sys-color-text-primary w-full resize-y border p-4 leading-relaxed"
        />
      </section>

      <fieldset className="space-y-2 pt-1">
        <legend className="sr-only">Choose a service</legend>
        <div className="flex flex-wrap gap-2">
          {scheduleServices.map((service) => (
            <label
              key={service.id}
              className="text-interface-base-small text-sys-color-text-primary flex min-h-11 cursor-pointer items-center gap-2 pr-4"
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
    </div>
  );
}
