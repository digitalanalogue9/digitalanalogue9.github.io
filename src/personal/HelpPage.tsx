import { useEffect, useState } from 'react';
import PageMetadata from './PageMetadata';
import './HelpPage.css';
import { isBehaviourReflectionEnabled } from '@/lib/utils/config/featureFlags';

const preferenceKey = 'show-instructions';

const guideViews = [
  {
    title: 'Sort the cards',
    caption: 'Place each value in an importance category. You can move it if you change your mind.',
    src: '/images/how-it-works-sort.svg',
    alt: 'The Security card is being placed into Very Important, with the other importance categories shown as buttons.',
  },
  {
    title: 'Narrow your choices',
    caption: 'Values in Not Important are removed when you move to the next round.',
    src: '/images/how-it-works-narrow.svg',
    alt: 'Two sample rounds show selected values carried forward and a value in Not Important removed before the next round.',
  },
  {
    title: 'Reflect on your final set',
    caption: 'Add an optional note about why each value matters to you.',
    src: '/images/how-it-works-reflect.svg',
    alt: 'A final example set lists Learning, Independence and Helping others beside a field for an optional note.',
  },
];

export default function HelpPage() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const behaviourReflectionEnabled = isBehaviourReflectionEnabled();

  useEffect(() => {
    try {
      setShowInstructions(window.localStorage.getItem(preferenceKey) !== 'false');
    } catch {
      setShowInstructions(true);
    }
  }, []);

  const toggleInstructions = (checked: boolean) => {
    setShowInstructions(checked);
    try {
      window.localStorage.setItem(preferenceKey, String(checked));
    } catch {
      // The preference remains usable for this page view if storage is unavailable.
    }
  };

  return (
    <article className="help-guide editorial-page" aria-labelledby="help-heading">
      <PageMetadata
        title="How it works · Core Values"
        description="See how to sort value cards, narrow your choices and reflect on your final set. Find guidance on saved exercises, History and backups."
        path="/howtouse"
      />

      <header className="help-guide__opening">
        <h1 id="help-heading" className="page-heading text-4xl sm:text-5xl lg:text-6xl">How it works</h1>
        <p className="page-intro max-w-[60ch]">
          Sort values, narrow your choices, and reflect on the ones that matter most.
        </p>
      </header>

      <section aria-labelledby="set-heading" className="help-guide__before">
        <h2 id="set-heading">Before you begin</h2>
        <p>
          Choose personal or team values, then set how many you want to keep. For a team exercise, discuss and agree on
          the values together.
        </p>
      </section>

      <section className="help-guide__views" aria-label="Exercise examples">
        {guideViews.map((view, index) => (
          <figure className="help-guide__view" key={view.title}>
            {failedImages.includes(view.src) ? (
              <div className="help-guide__image-fallback" role="img" aria-label={view.alt}>
                <span>Example view unavailable</span>
                <p>{view.alt}</p>
              </div>
            ) : (
              <img
                src={view.src}
                alt={view.alt}
                width="960"
                height="600"
                loading="lazy"
                onError={() => setFailedImages((current) => [...current, view.src])}
              />
            )}
            <figcaption>
              <span className="help-guide__view-number">0{index + 1}</span>
              <div>
                <h2>{view.title}</h2>
                <p>{view.caption}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </section>

      <section aria-labelledby="reflection-heading" className="help-guide__reflection">
        <h2 id="reflection-heading">Reflect on your values</h2>
        <p>
          After adding optional notes to your final values, use the reflection section to consider questions about each
          value, record observations, and set an optional reflection goal. Save your reflection to return to it later.
        </p>
      </section>

      <section aria-labelledby="behaviour-heading" className="help-guide__reminders">
        <h2 id="behaviour-heading">Set up a reflection reminder</h2>
        <p>After a behaviour reflection, copy a recurring prompt for Claude, Copilot, or ChatGPT:</p>
        <ol className="help-guide__steps">
          <li>
            Choose <strong>Continue with a conversation prompt</strong>, then select <strong>Recurring prompt</strong>.
          </li>
          <li>
            Choose a reflection possibility, select <strong>Daily</strong>, and set the time and time zone.
          </li>
          <li>Copy the prompt into Claude, Copilot, or ChatGPT and ask it to create a daily reminder.</li>
        </ol>
        <p>The app creates the prompt; reminders depend on the AI service’s scheduling features.</p>
        {behaviourReflectionEnabled && <a href="/behaviour">Start a behaviour reflection</a>}
      </section>

      <section aria-labelledby="preference-heading" className="help-guide__preference">
        <h2 id="preference-heading">Exercise instructions</h2>
        <label>
          <input
            type="checkbox"
            checked={showInstructions}
            onChange={(event) => toggleInstructions(event.currentTarget.checked)}
            aria-describedby="instructions-description"
          />
          Show instructions when starting the exercise
        </label>
        <p id="instructions-description" role="status">
          {showInstructions
            ? 'Instructions will appear at the start of each new exercise.'
            : 'Instructions will not appear automatically.'}
        </p>
      </section>

      <footer className="help-guide__closing">
        <p>
          Your reflections stay in this browser and don’t sync across devices. Export a backup from History to move them
          to another device.
        </p>
      </footer>
    </article>
  );
}
