import { Link } from 'react-router-dom';
import valueCatalogue from '@/data/values.json';
import teamValueCatalogue from '@/data/team-values.json';
import { isBehaviourReflectionEnabled } from '@/lib/utils/config/featureFlags';

function featuredCards(catalogue: typeof valueCatalogue, titles: string[]) {
  return titles.map((title) => {
    const value = catalogue.values.find((item) => item.title === title);
    if (!value) throw new Error(`The public example value ${title} is missing from the catalogue.`);
    return {
      ...value,
      displayTitle: title
        .toLocaleLowerCase('en-GB')
        .replace(/^\w/, (character) => character.toLocaleUpperCase('en-GB')),
    };
  });
}

const featuredValues = featuredCards(valueCatalogue, ['LEARNING', 'INDEPENDENCE', 'HELPING OTHERS']);
const featuredTeamValues = featuredCards(teamValueCatalogue, ['TEAMWORK', 'INCLUSIVITY', 'GROWTH']);

function ExampleCards({ team = false }: { team?: boolean }) {
  return (
    <figure
      className="editorial-card-composition"
      aria-label={`Three values from the ${team ? 'team' : 'personal'} card sort`}
    >
      {(team ? featuredTeamValues : featuredValues).map((value, index) => (
        <article className={`editorial-value-card editorial-value-card--${index + 1}`} key={value.id}>
          <h3>{value.displayTitle}</h3>
          <p>{value.description}</p>
        </article>
      ))}
      <figcaption>
        {team
          ? 'Explore values that could guide your work together.'
          : 'Choose between values that matter in different ways.'}
      </figcaption>
    </figure>
  );
}

const situations = [
  'Considering a change of job',
  'Preparing for a conversation with a coach',
  'Wondering what you want more of in your working life',
];

function TeamActionSection({ placement }: { placement: 'mobile' | 'desktop' }) {
  const headingId = `team-values-heading-${placement}`;

  return (
    <section className={`editorial-situations editorial-team editorial-team--${placement}`} aria-labelledby={headingId}>
      <div className="editorial-team-copy">
        <h2 id={headingId}>What matters to your team?</h2>
        <p>
          In a meeting, sort team-focused cards, discuss the trade-offs, then agree which values should guide your work
          together.
        </p>
        {placement === 'desktop' && (
          <Link className="editorial-button editorial-button--primary" to="/exercise?exerciseType=team">
            Start a team values conversation
          </Link>
        )}
      </div>
      {placement === 'desktop' && <ExampleCards team />}
      {placement === 'mobile' && (
        <div>
          <Link className="editorial-button editorial-button--primary" to="/exercise?exerciseType=team">
            Start a team values conversation
          </Link>
        </div>
      )}
    </section>
  );
}

function PersonalAction() {
  return (
    <>
      <h2 className="editorial-personal-heading">Which things matter to you?</h2>
      <p className="editorial-lede">
        Sort value cards to explore your priorities, then reflect on what your final set means to you.{' '}
        <Link className="editorial-text-link editorial-inline-link" to="/howtouse">
          See how it works
        </Link>{' '}
        or{' '}
        <Link className="editorial-history-link editorial-inline-link" to="/history">
          Resume an exercise
        </Link>
        .
      </p>
      <div className="editorial-actions">
        <Link className="editorial-button editorial-button--primary" to="/exercise">
          Find my core values
        </Link>
      </div>
    </>
  );
}

function SituationsSection({ placement }: { placement: 'mobile' | 'desktop' }) {
  const headingId = `situations-heading-${placement}`;
  return (
    <section className="editorial-situations" aria-labelledby={headingId}>
      <div>
        <h2 id={headingId}>When a decision pulls you in different directions</h2>
        <p>
          {placement === 'mobile'
            ? 'Your values can help you weigh priorities, from a job change to a conversation or decisions about working life.'
            : 'Understanding your values can help you weigh competing priorities.'}
        </p>
      </div>
      {placement === 'desktop' && (
        <ul className="editorial-situations-list" aria-label="Possible moments for reflection">
          {situations.map((situation) => (
            <li key={situation}>{situation}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ReflectionSection({ placement }: { placement: 'mobile' | 'desktop' }) {
  const headingId = `closing-heading-${placement}`;
  return (
    <section className="editorial-closing" aria-labelledby={headingId}>
      <h2 id={headingId}>Make room to reflect on what matters to you.</h2>
      <p>You can return to your reflections when you want to think them through again.</p>
    </section>
  );
}

function StorageNote({ heading = false }: { heading?: boolean }) {
  return (
    <section className="editorial-storage-section" aria-label="Where your reflections are kept">
      {heading && <h2>Where your reflections are kept</h2>}
      <p className="editorial-storage-note">
        Your reflections are saved in the browser you’re using now. They won’t appear on another device automatically.
        To keep a copy, go to{' '}
        <Link className="editorial-history-link" to="/history">
          History
        </Link>{' '}
        and export a backup before clearing your browser data or changing devices.
      </p>
    </section>
  );
}

export default function HomeClient() {
  const behaviourReflectionEnabled = isBehaviourReflectionEnabled();

  return (
    <div className="editorial-home">
      <div className="editorial-mobile-journey">
        <h1>Some things matter more.</h1>
        <SituationsSection placement="mobile" />
        <ReflectionSection placement="mobile" />
        <section className="editorial-personal" aria-label="Personal values">
          <PersonalAction />
        </section>
        <TeamActionSection placement="mobile" />
        <StorageNote />
      </div>

      <div className="editorial-desktop-journey">
        <header className="editorial-home-heading">
          <h1>Some things matter more.</h1>
        </header>
        <SituationsSection placement="desktop" />
        <ReflectionSection placement="desktop" />
        <div className="editorial-action-sections">
          <section className="editorial-personal editorial-personal--desktop" aria-label="Personal values">
            <div>
              <PersonalAction />
            </div>
            <ExampleCards />
          </section>
          <TeamActionSection placement="desktop" />
        </div>
        <StorageNote heading />
      </div>

      {behaviourReflectionEnabled && (
        <section className="editorial-behaviour" aria-labelledby="behaviour-heading">
          <div>
            <h2 id="behaviour-heading">See your choices from another angle</h2>
            <p>
              Consider six everyday situations at work and choose how you might respond. Then explore possible
              intentions and perspectives behind those choices.
            </p>
            <p>These prompts offer possibilities for reflection. They do not tell you what another person thinks.</p>
          </div>
          <Link className="editorial-button editorial-button--light" to="/behaviour">
            Explore behaviour reflection
          </Link>
        </section>
      )}
    </div>
  );
}
