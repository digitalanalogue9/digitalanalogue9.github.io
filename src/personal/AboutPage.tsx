import PageMetadata from './PageMetadata';

export default function AboutPage() {
  return (
    <article
      className="app-page-panel editorial-home mx-auto w-full max-w-4xl space-y-12"
      aria-labelledby="about-heading"
    >
      <PageMetadata
        title="About Core Values · A borrowed deck of cards"
        description="A borrowed deck of cards led to Core Values, a tool for sorting values and returning to the priorities you choose."
        path="/about"
      />

      <header className="space-y-4">
        <h1 id="about-heading" className="max-w-[18ch] text-4xl sm:text-5xl lg:text-6xl">
          It started with a borrowed deck of cards.
        </h1>
        <p className="page-intro max-w-[70ch]">
          The exercise helped me name what mattered and made me want a way to return to it.
        </p>
        <div className="max-w-[70ch] space-y-4 text-lg leading-relaxed">
          <p>
            While working with a coach, I used a deck of cards to identify my core values. I found the exercise useful,
            but the cards belonged to her, so I had to return them. I wanted a way to revisit those choices as life
            changed. That became the starting point for Core Values.
          </p>
          <p>I later decided to share the tool in case it could help others reflect on what matters to them.</p>
        </div>
      </header>

      <section
        className="max-w-[70ch] space-y-4 border-t border-[var(--editorial-line)] pt-8"
        aria-labelledby="what-you-can-do"
      >
        <h2 id="what-you-can-do" className="text-3xl sm:text-4xl">
          Sort and reflect on your values
        </h2>
        <p className="leading-relaxed">
          Core Values gives you a set of cards to sort by importance. Over a series of rounds, you choose which values
          to keep. You can add notes about why they matter and come back to your choices later.
        </p>
        <p className="leading-relaxed">
          If you’re weighing a decision or thinking about a change, the exercise gives you a starting point for putting
          your priorities into words. What you take from it is yours to consider.
        </p>
      </section>

      <section
        className="max-w-[70ch] space-y-4 border-t border-[var(--editorial-line)] pt-8"
        aria-labelledby="conversation-heading"
      >
        <h2 id="conversation-heading" className="text-3xl sm:text-4xl">
          A starting point for a conversation
        </h2>
        <p className="leading-relaxed">
          You can use the exercise on your own or bring your chosen values to a conversation with a coach.
        </p>
        <p className="leading-relaxed">
          There’s also a team-focused set for discussing what matters to your team at work and agreeing on your team’s
          core values together.
        </p>
      </section>

      <section
        className="max-w-[70ch] space-y-4 border-t border-[var(--editorial-line)] pt-8"
        aria-labelledby="further-reading"
      >
        <h2 id="further-reading" className="text-3xl sm:text-4xl">
          Further perspectives
        </h2>
        <p className="leading-relaxed">
          These articles, conversations and talks offer other ways to think about values and the choices we make.
        </p>
        <ul className="list-inside list-disc space-y-3 leading-relaxed">
          <li>
            <a
              href="https://jamesclear.com/values-choices"
              target="_blank"
              rel="noreferrer"
              className="editorial-text-link"
            >
              James Clear: Let Your Values Drive Your Choices
            </a>
          </li>
          <li>
            <a
              href="https://brenebrown.com/podcast/living-into-our-values/"
              target="_blank"
              rel="noreferrer"
              className="editorial-text-link"
            >
              Brené Brown and Barrett Guillen: Living Into Our Values
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=mL4l75rMIiQ"
              target="_blank"
              rel="noreferrer"
              className="editorial-text-link"
            >
              Larisa Halilović: Core Values - Your Inner Compass
            </a>
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-[#584451]">
          These links are provided for further reading and listening. They don’t imply an endorsement of Core Values.
        </p>
      </section>
    </article>
  );
}
