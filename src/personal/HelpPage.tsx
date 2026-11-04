import { useEffect, useState } from 'react';
import PageMetadata from './PageMetadata';

const preferenceKey = 'show-instructions';
const steps = [
  [
    'Choose how many values',
    'Select how many core values you want to finish with. The default is 10; choosing fewer makes the exercise more challenging.',
  ],
  [
    'Prioritise your values',
    'For each value, decide how important it is and move its card to the matching category. Values in Not Important are removed between rounds.',
  ],
  [
    'Explain your choices',
    'You can record why you chose your final values. This is optional, but it can help you remember what matters to you.',
  ],
  ['Review and update', 'Revisit your choices periodically as you grow and your circumstances change.'],
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
    <article className="mx-auto w-full max-w-4xl space-y-5 p-4" aria-labelledby="help-heading">
      <PageMetadata
        title="How to use Core Values"
        description="Learn how to choose, prioritise, and reflect on your personal core values."
        path="/howtouse"
      />
      <h1 id="help-heading" className="text-center text-3xl font-bold">
        How to use Core Values
      </h1>
      <ol className="space-y-4">
        {steps.map(([title, description], index) => (
          <li key={title} className="rounded-lg bg-blue-100 p-5">
            <h2 className="mb-2 text-xl font-bold">
              Step {index + 1}: {title}
            </h2>
            <p>{description}</p>
          </li>
        ))}
      </ol>
      <section className="rounded-lg bg-purple-100 p-5" aria-labelledby="reminder-heading">
        <h2 id="reminder-heading" className="mb-2 text-xl font-bold">
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
    </article>
  );
}
