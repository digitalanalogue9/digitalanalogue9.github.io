import PageMetadata from './PageMetadata';

export default function AboutPage() {
  return (
    <article className="app-page-panel mx-auto max-w-5xl space-y-6" aria-labelledby="about-heading">
      <PageMetadata
        title="About Core Values"
        description="Why Core Values was created and how identifying your values can support personal growth."
        path="/about"
      />
      <h1 id="about-heading" className="text-interface-title-1 text-center font-semibold">
        The story behind Core Values
      </h1>
      <section aria-label="Origin story" className="app-content-card space-y-3">
        <p>
          I was fortunate to work with a coach who helped me think things through. In one of our early sessions, she
          lent me a deck of cards to help me identify my core values. I found the exercise useful, and learned that it
          can be worth revisiting those choices as life changes.
        </p>
        <p>
          The cards belonged to my coach, so I had to return them. I wanted a set of my own that I could revisit when I
          needed it. That was the starting point for Core Values.
        </p>
        <p>I later decided to share the tool in case it could help others reflect on what matters to them.</p>
      </section>
      <section aria-labelledby="why-matters-heading" className="app-content-card space-y-3">
        <h2 id="why-matters-heading" className="text-interface-title-2 font-semibold">
          Why values matter
        </h2>
        <p>
          Focus on what is within your control. Taking time to consider your values can bring that perspective to
          everyday choices.
        </p>
        <p>
          <strong>For you:</strong> Your values can help make what matters clearer when you are weighing a decision,
          planning a next step, or reflecting on change.
        </p>
        <p>
          <strong>For teams:</strong> Team-focused values offer a useful starting point for a discussion about shared
          priorities.
        </p>
      </section>
      <section aria-labelledby="further-reading" className="app-content-card space-y-3">
        <h2 id="further-reading" className="text-interface-title-2 font-semibold">
          Further perspectives
        </h2>
        <p>These reading, audio, and video resources offer additional perspectives on values and the choices we make.</p>
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
