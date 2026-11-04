import PageMetadata from './PageMetadata';

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-4xl space-y-6 p-4" aria-labelledby="about-heading">
      <PageMetadata
        title="About Core Values"
        description="Why Core Values was created and how identifying your values can support personal growth."
        path="/about"
      />
      <h1 id="about-heading" className="text-center text-3xl font-bold">
        More information about Core Values
      </h1>
      <section aria-labelledby="why-values-matter" className="rounded-lg bg-purple-100 p-5">
        <h2 id="why-values-matter" className="mb-3 text-xl font-bold">
          ❤️ Why Core Values matter
        </h2>
        <p className="mb-3">
          Whether you are at a crossroads in life, planning your future, or simply want to better understand yourself,
          identifying your core values provides a compass for decision-making and personal growth.
        </p>
        <p>
          You can also use Core Values to help your team or group identify shared values and align on a common purpose.
        </p>
      </section>
      <section aria-labelledby="inspiration" className="rounded-lg bg-blue-100 p-5">
        <h2 id="inspiration" className="mb-3 text-xl font-bold">
          💡 The inspiration behind Core Values
        </h2>
        <p className="mb-3">
          The idea came from a set of physical cards lent to me by my coach. I found the exercise helpful and wanted my
          own set of cards to revisit as life and circumstances change.
        </p>
        <p>I made Core Values available online in the hope that you will find it helpful too.</p>
      </section>
      <section aria-labelledby="further-reading" className="rounded-lg bg-green-100 p-5">
        <h2 id="further-reading" className="mb-3 text-xl font-bold">
          💬 Further reading and listening
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <a href="https://jamesclear.com/values-choices" target="_blank" rel="noreferrer">
              James Clear: Let Your Values Drive Your Choices
            </a>
          </li>
          <li>
            <a href="https://brenebrown.com/podcast/living-into-our-values/" target="_blank" rel="noreferrer">
              Brené Brown and Barrett Guillen: Living Into Our Values
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/watch?v=mL4l75rMIiQ" target="_blank" rel="noreferrer">
              Larisa Halilović: Core Values - Your Inner Compass
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
