import { useEffect, useState } from 'react';
import PageMetadata from './PageMetadata';

const preferenceKey = 'show-instructions';
const steps = [
  [
    'Choose a value set and set a target',
    'Choose personal values or a team-focused set, then select how many core values you want to finish with. The default target is 10. The team-focused set is still a personal exercise; the app does not provide multi-user collaboration.',
  ],
  [
    'Sort each value',
    'Choose an importance category for each value and select Place value. You can move placed values to another category. Values in Not Important are removed when you continue to the next round.',
  ],
  [
    'Continue until you reach your target',
    'Your progress is saved in this browser as you go. Keep sorting through the rounds until you have your target number of core values.',
  ],
  [
    'Reflect and review',
    'When you finish, you can add optional notes about your final values. Use History to resume an unfinished Session, review a completed one, replay its rounds, or export a backup.',
  ],
];

export default function HelpPage() {
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    setShowInstructions(window.localStorage.getItem(preferenceKey) !== 'false');
  }, []);

  const toggleInstructions = (checked: boolean) => {
    setShowInstructions(checked);
    window.localStorage.setItem(preferenceKey, String(checked));
  };

  return (
    <article className="app-page-panel mx-auto max-w-5xl space-y-6" aria-labelledby="help-heading">
      <PageMetadata
        title="How to use Core Values"
        description="Learn how to sort values, reflect on your choices, and manage locally saved Core Values sessions."
        path="/howtouse"
      />
      <h1 id="help-heading" className="text-interface-title-1 text-center font-semibold">
        How to use Core Values
      </h1>
      <ol className="space-y-4">
        {steps.map(([title, description], index) => (
          <li key={title} className="app-content-card">
            <h2 className="text-interface-title-2 mb-2 font-semibold">
              Step {index + 1}: {title}
            </h2>
            <p>{description}</p>
          </li>
        ))}
      </ol>
      <section className="app-content-card" aria-labelledby="reminder-heading">
        <h2 id="reminder-heading" className="text-interface-title-2 mb-2 font-semibold">
          Want a reminder when you play?
        </h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showInstructions}
            onChange={(event) => toggleInstructions(event.currentTarget.checked)}
            aria-describedby="instructions-description"
          />
          Show instructions when starting the exercise
        </label>
        <p id="instructions-description" className="mt-2">
          {showInstructions
            ? 'Instructions will appear at the start of each new exercise.'
            : 'Instructions will not appear automatically.'}
        </p>
      </section>
      <section className="app-content-card space-y-3" aria-labelledby="behaviour-heading">
        <h2 id="behaviour-heading" className="text-interface-title-2 font-semibold">
          Explore possible perspectives on your behaviour
        </h2>
        <p>
          In a separate reflection, choose how you might respond to six everyday work situations. When you finish, you
          can consider possible intentions and how someone else might experience those actions. These are prompts for
          reflection, not conclusions about your behaviour or another person’s thoughts.
        </p>
        <p>Your scenario choices and notes are saved in this browser.</p>
      </section>
      <section className="app-content-card space-y-3" aria-labelledby="sessions-heading">
        <h2 id="sessions-heading" className="text-interface-title-2 font-semibold">
          Your sessions stay in this browser
        </h2>
        <p>
          Values exercises and scenario reflections are stored on this device. They do not automatically appear in
          another browser or on another device. Export a backup from History if you want to keep or move a copy.
        </p>
      </section>
    </article>
  );
}
