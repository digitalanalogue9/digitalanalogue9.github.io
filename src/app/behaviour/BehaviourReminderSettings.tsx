import { useId, useState } from 'react';
import {
  createDefaultBehaviourReminderSchedule,
  isValidIanaTimeZone,
  type BehaviourReminderSchedule,
} from '@/lib/domain/behaviourReminder';

type BehaviourReminderSettingsProps = {
  value?: BehaviourReminderSchedule;
  onChange: (schedule: BehaviourReminderSchedule) => void;
};

const weekdays = [
  ['Monday', 1],
  ['Tuesday', 2],
  ['Wednesday', 3],
  ['Thursday', 4],
  ['Friday', 5],
  ['Saturday', 6],
  ['Sunday', 7],
] as const;

export function BehaviourReminderSettings({ value, onChange }: BehaviourReminderSettingsProps) {
  const [internalValue, setInternalValue] = useState(createDefaultBehaviourReminderSchedule);
  const schedule = value ?? internalValue;
  const timezoneErrorId = useId();
  const timezoneHintId = useId();
  const timezoneIsValid = isValidIanaTimeZone(schedule.timezone);

  const updateSchedule = (updates: Partial<BehaviourReminderSchedule>) => {
    const nextSchedule = { ...schedule, ...updates };
    if (value === undefined) setInternalValue(nextSchedule);
    onChange(nextSchedule);
  };

  return (
    <fieldset className="space-y-4" aria-describedby="behaviour-prompt-schedule-help">
      <legend className="text-interface-base-default text-sys-color-text-primary mb-2 font-semibold">
        Recurring prompt preferences
      </legend>
      <p id="behaviour-prompt-schedule-help" className="text-interface-base-small text-sys-color-text-primary">
        These cadence, day, local time, and time zone preferences are saved in this browser to shape the copied prompt.
        They do not schedule anything in Copilot or another service.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label
          className="text-interface-base-small text-sys-color-text-primary flex flex-col gap-1"
          htmlFor="behaviour-reminder-cadence"
        >
          <span>Cadence</span>
          <select
            id="behaviour-reminder-cadence"
            className="apc-field__control min-h-11"
            value={schedule.cadence}
            onChange={(event) =>
              updateSchedule({ cadence: event.target.value as BehaviourReminderSchedule['cadence'] })
            }
          >
            <option value="daily">Daily</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
        <label
          className="text-interface-base-small text-sys-color-text-primary flex flex-col gap-1"
          htmlFor="behaviour-reminder-time"
        >
          <span>Local time</span>
          <input
            id="behaviour-reminder-time"
            className="apc-field__control min-h-11"
            type="time"
            value={schedule.time}
            onChange={(event) => updateSchedule({ time: event.target.value })}
          />
        </label>
        <div className="text-interface-base-small text-sys-color-text-primary flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="behaviour-reminder-timezone">Time zone</label>
          <input
            id="behaviour-reminder-timezone"
            className="apc-field__control min-h-11"
            type="text"
            inputMode="text"
            autoComplete="off"
            value={schedule.timezone}
            aria-invalid={!timezoneIsValid}
            aria-describedby={`${timezoneHintId}${timezoneIsValid ? '' : ` ${timezoneErrorId}`}`}
            onChange={(event) => updateSchedule({ timezone: event.target.value })}
          />
          <span className="text-sys-color-text-secondary" id={timezoneHintId}>
            Use an IANA name such as Europe/London or America/New_York.
          </span>
          {!timezoneIsValid && (
            <span className="text-ref-color-rag-red-text" id={timezoneErrorId} role="alert">
              Enter a valid IANA time zone.
            </span>
          )}
        </div>
        {schedule.cadence === 'weekly' && (
          <label
            className="text-interface-base-small text-sys-color-text-primary flex flex-col gap-1 sm:col-span-2"
            htmlFor="behaviour-reminder-weekday"
          >
            <span>Day of week</span>
            <select
              id="behaviour-reminder-weekday"
              className="apc-field__control min-h-11"
              value={schedule.weekday}
              onChange={(event) => updateSchedule({ weekday: Number(event.target.value) })}
            >
              {weekdays.map(([name, day]) => (
                <option key={day} value={day}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </fieldset>
  );
}
