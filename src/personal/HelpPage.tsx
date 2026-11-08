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

const actions = [
  { href: '/exercise', label: 'Find my core values', primary: true },
  { href: '/history', label: 'View History' },
];

export default function HelpPage() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const behaviourReflectionEnabled = isBehaviourReflectionEnabled();
  const visibleActions = behaviourReflectionEnabled
    ? [...actions, { href: '/behaviour', label: 'Explore behaviour reflection' }]
    : actions;

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
        title="How Core Values works"
        description="See how to sort value cards, narrow your choices and reflect on your final set. Find guidance on saved exercises, History and backups."
        path="/howtouse"
      />

      <header className="help-guide__opening">
        <p className="help-guide__eyebrow">How it works</p>
        <h1 id="help-heading">Sort. Narrow. Reflect.</h1>
        <p className="help-guide__lede">
          Choose how important each value is to you, narrow the set over further rounds, then reflect on the values you
          keep.
        </p>
        <nav className="help-guide__actions" aria-label="How it works actions">
          {visibleActions.map(({ href, label, primary }) => (
            <a
              className={primary ? 'editorial-button editorial-button--primary' : 'help-guide__text-link'}
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="help-guide__views" aria-label="Example exercise">
        <div className="help-guide__section-heading">
          <p className="help-guide__eyebrow">Example exercise</p>
          <p>These composed views use sample values to show what each stage looks like.</p>
        </div>
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

      <div className="help-guide__details">
        <section aria-labelledby="set-heading">
          <p className="help-guide__eyebrow">Before you begin</p>
          <h2 id="set-heading">Choose your set and target</h2>
          <p>
            Choose personal values or the team-focused set, then decide how many values you want to finish with. The
            team-focused set is an individual exercise you can use before a conversation about working together.
          </p>
        </section>

        <section aria-labelledby="sorting-heading">
          <p className="help-guide__eyebrow">During the exercise</p>
          <h2 id="sorting-heading">Sort and narrow</h2>
          <p>
            Choose an importance category for each card. You can move cards between categories if you change your mind.
            When you advance, values in Not Important are removed. Continue sorting the remaining values until you reach
            your chosen number.
          </p>
        </section>

        <section aria-labelledby="reflection-heading">
          <p className="help-guide__eyebrow">After the final round</p>
          <h2 id="reflection-heading">Reflect and return</h2>
          <p>
            Add an optional note about why each final value matters. Use History to resume an unfinished exercise,
            review a completed one or replay its rounds.
          </p>
          <a href="/history">Open History</a>
        </section>

        <section aria-labelledby="backup-heading">
          <p className="help-guide__eyebrow">Keep a copy</p>
          <h2 id="backup-heading">Back up your work</h2>
          <p>
            Your progress is saved in this browser. It won’t automatically appear on another device. Before clearing
            browser data or moving your work, export a backup from History and keep the file private.
          </p>
          <p>
            Check what your chosen export includes. The standard values JSON export doesn’t include the additional
            reflection notes you add on the completed exercise page. Choose <strong>Export reflection backup</strong> in
            History to include them.
          </p>
          <a href="/history">Go to History to export a backup</a>
        </section>

        <section aria-labelledby="preference-heading" className="help-guide__preference">
          <p className="help-guide__eyebrow">Your preference</p>
          <h2 id="preference-heading">Show instructions next time</h2>
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

        {behaviourReflectionEnabled && (
          <section aria-labelledby="behaviour-heading">
            <p className="help-guide__eyebrow">A different kind of reflection</p>
            <h2 id="behaviour-heading">Explore possible perspectives on your behaviour</h2>
            <p>
              Consider how you might respond to six everyday situations at work. You can choose “It depends” or skip any
              situation. When you finish, explore possible intentions and perspectives on your choices. These prompts do
              not tell you what another person thinks or feels.
            </p>
            <p>Your choices and notes are saved in this browser.</p>
            <a href="/behaviour">Explore behaviour reflection</a>
          </section>
        )}
      </div>

      <footer className="help-guide__closing">
        <p>Your reflections stay in this browser and don’t sync automatically between devices.</p>
        <nav className="help-guide__actions" aria-label="Continue from How it works">
          {visibleActions.map(({ href, label, primary }) => (
            <a
              className={primary ? 'editorial-button editorial-button--primary' : 'help-guide__text-link'}
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>
      </footer>
    </article>
  );
}
