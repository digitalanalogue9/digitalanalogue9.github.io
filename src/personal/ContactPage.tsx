import PageMetadata from './PageMetadata';

export default function ContactPage() {
  return (
    <article
      className="app-page-panel editorial-home mx-auto w-full max-w-4xl space-y-10"
      aria-labelledby="contact-heading"
    >
      <PageMetadata
        title="Contact · Core Values"
        description="Ask a question, share an idea or report a problem with Core Values. Find the email address for feedback and privacy requests."
        path="/contact"
      />

      <header className="max-w-[65ch] space-y-4">
        <h1 id="contact-heading" className="text-4xl sm:text-5xl lg:text-6xl">
          A question, an idea, or something that didn’t work?
        </h1>
        <p className="page-intro">
          If you have a question about the exercise, an idea to share or a problem to report, I’d like to hear from you.
        </p>
      </header>

      <section
        className="max-w-[65ch] space-y-4 border-t border-[var(--editorial-line)] pt-8"
        aria-label="Contact details"
      >
        <p className="text-lg leading-relaxed">
          Email{' '}
          <a className="editorial-text-link break-words" href="mailto:corevaluesanalytics@gmail.com">
            corevaluesanalytics@gmail.com
          </a>
          . You can use the same address for privacy questions and requests.
        </p>
      </section>
    </article>
  );
}
