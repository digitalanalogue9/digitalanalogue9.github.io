import { Link } from 'react-router-dom';
import valueCatalogue from '@/data/values.json';

const featuredValues = ['LEARNING', 'INDEPENDENCE', 'HELPING OTHERS'].map((title) => {
  const value = valueCatalogue.values.find((item) => item.title === title);
  if (!value) throw new Error(`The public example value ${title} is missing from the catalogue.`);

  return {
    ...value,
    displayTitle: title
      .toLocaleLowerCase('en-GB')
      .replace(/^\w/, (character) => character.toLocaleUpperCase('en-GB')),
  };
});

const situations = ['Considering a change of job', 'Preparing for a conversation with a coach', 'Wondering what you want more of in your working life'];

export default function HomeClient() {
  return (
    <div className="editorial-home">
      <section className="editorial-hero" aria-labelledby="home-heading">
        <div className="editorial-hero-copy">
          <h1 id="home-heading">Some things matter more. Which things matter to you?</h1>
          <p className="editorial-lede">
            Sort value cards to explore your priorities. Narrow your choices, then reflect on what your final set means to you.
          </p>
          <div className="editorial-actions">
            <Link className="editorial-button editorial-button--primary" to="/exercise">
              Find my core values
            </Link>
            <Link className="editorial-text-link" to="/howtouse">
              See how it works
            </Link>
          </div>
          <Link className="editorial-history-link" to="/history">
            Resume an exercise in History
          </Link>
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

      <section className="editorial-outcome" aria-labelledby="example-heading">
        <div className="editorial-section-intro">
          <h2 id="example-heading">Example outcome</h2>
          <p>A final set gives you something concrete to reflect on. You can add a note about why each value matters to you.</p>
          <p className="editorial-aside">This is an illustrative selection, not a prescribed final count. You choose how many values to keep.</p>
        </div>
        <div className="editorial-outcome-content">
          <ul className="editorial-outcome-values" aria-label="Illustrative final set">
            {featuredValues.map((value) => (
              <li key={value.id}>
                <h3>{value.displayTitle}</h3>
                <p>{value.description}</p>
              </li>
            ))}
          </ul>
          <blockquote className="editorial-note">
            <cite>Illustrative note for Learning</cite>
            <p>“I want room to learn in whatever I do next.”</p>
          </blockquote>
        </div>
      </section>

      <section className="editorial-situations" aria-labelledby="situations-heading">
        <div>
          <h2 id="situations-heading">When a decision pulls you in different directions</h2>
          <p>
            Sorting the cards gives you a way to consider which priorities come first. You can return to the exercise as your circumstances change.
          </p>
        </div>
        <ul className="editorial-situations-list" aria-label="Possible moments for reflection">
          {situations.map((situation) => <li key={situation}>{situation}</li>)}
        </ul>
      </section>

      <section className="editorial-process" aria-labelledby="process-heading">
        <div className="editorial-section-intro">
          <h2 id="process-heading">Sort. Narrow. Reflect.</h2>
          <p>Work through a set of values, making choices and returning to the ones that feel most important.</p>
        </div>
        <ol className="editorial-process-list">
          <li>
            <h3>Sort</h3>
            <p>Consider each value and choose how important it is to you.</p>
          </li>
          <li>
            <h3>Narrow</h3>
            <p>Work through further rounds to decide which values to keep. You choose how many to finish with.</p>
          </li>
          <li>
            <h3>Reflect</h3>
            <p>Add optional notes about your final values. Revisit your choices in History when you want to think them through again.</p>
          </li>
        </ol>
        <Link className="editorial-text-link" to="/howtouse">See how it works</Link>
      </section>

      <section className="editorial-behaviour" aria-labelledby="behaviour-heading">
        <div>
          <h2 id="behaviour-heading">See your choices from another angle</h2>
          <p>
            Consider six everyday situations at work and choose how you might respond. Then explore possible intentions and perspectives behind those choices.
          </p>
          <p>These prompts offer possibilities for reflection. They do not tell you what another person thinks.</p>
        </div>
        <Link className="editorial-button editorial-button--light" to="/behaviour">Explore behaviour reflection</Link>
      </section>

      <section className="editorial-closing" aria-labelledby="closing-heading">
        <h2 id="closing-heading">Make room to reflect on what matters to you.</h2>
        <p>Find your values, make choices between them, then return to your reflections when you want to think them through again.</p>
        <p className="editorial-storage-note">Your reflections stay in this browser.</p>
        <div className="editorial-actions">
          <Link className="editorial-button editorial-button--primary" to="/exercise">Find my core values</Link>
          <Link className="editorial-text-link" to="/history">View History</Link>
        </div>
      </section>
    </div>
  );
}
