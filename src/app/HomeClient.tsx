import { Link } from 'react-router-dom';
import valueCatalogue from '@/data/values.json';
import { isBehaviourReflectionEnabled } from '@/lib/utils/config/featureFlags';

const featuredValues = ['LEARNING', 'INDEPENDENCE', 'HELPING OTHERS'].map((title) => {
  const value = valueCatalogue.values.find((item) => item.title === title);
  if (!value) throw new Error(`The public example value ${title} is missing from the catalogue.`);
  return {
    ...value,
    displayTitle: title.toLocaleLowerCase('en-GB').replace(/^\w/, (character) => character.toLocaleUpperCase('en-GB')),
  };
});

const situations = [
  'Considering a change of job',
  'Preparing for a conversation with a coach',
  'Wondering what you want more of in your working life',
];

export default function HomeClient() {
  const behaviourReflectionEnabled = isBehaviourReflectionEnabled();

  return (
    <div className="editorial-home">
      <section className="editorial-hero" aria-labelledby="home-heading">
        <div className="editorial-hero-copy">
          <h1 id="home-heading">Some things matter more. Which things matter to you?</h1>
          <p className="editorial-lede">
            Sort value cards to explore your priorities. Narrow your choices, then reflect on what your final set means
            to you.
          </p>
          <div className="editorial-actions">
            <Link className="editorial-button editorial-button--primary" to="/exercise">
              Find my core values
            </Link>
            <Link className="editorial-text-link" to="/howtouse">
              See how it works
            </Link>
            <Link className="editorial-history-link" to="/history">
              Resume an exercise in History
            </Link>
          </div>
        </div>
        <figure className="editorial-card-composition" aria-label="Three values from the personal card sort">
          {featuredValues.map((value, index) => (
            <article className={`editorial-value-card editorial-value-card--${index + 1}`} key={value.id}>
              <h2>{value.displayTitle}</h2>
              <p>{value.description}</p>
            </article>
          ))}
          <figcaption>Choose between values that matter in different ways.</figcaption>
        </figure>
      </section>

      <section className="editorial-situations" aria-labelledby="situations-heading">
        <div>
          <h2 id="situations-heading">When a decision pulls you in different directions</h2>
          <p>Understanding your values can help you weigh competing priorities.</p>
        </div>
        <ul className="editorial-situations-list" aria-label="Possible moments for reflection">
          {situations.map((situation) => (
            <li key={situation}>{situation}</li>
          ))}
        </ul>
      </section>

      <section className="editorial-closing" aria-labelledby="closing-heading">
        <h2 id="closing-heading">Make room to reflect on what matters to you.</h2>
        <p>You can return to your reflections when you want to think them through again.</p>
        <p className="editorial-storage-note">
          Your reflections stay in this browser and don’t sync automatically. Use{' '}
          <Link className="editorial-history-link" to="/history">
            History
          </Link>{' '}
          to export a backup before clearing browser data or changing devices.
        </p>
      </section>

      <section className="editorial-situations" aria-labelledby="team-values-heading">
        <div>
          <h2 id="team-values-heading">Or bring your team’s values into the room</h2>
          <p>
            Use the team-focused cards together in a meeting. Talk through the choices and trade-offs, then agree which
            values you want to guide how you work together.
          </p>
        </div>
        <div>
          <Link className="editorial-button editorial-button--primary" to="/exercise">
            Start a team values conversation
          </Link>
        </div>
      </section>

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
