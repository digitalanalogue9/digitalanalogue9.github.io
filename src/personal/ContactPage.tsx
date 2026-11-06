import { Link } from 'react-router-dom';
import PageMetadata from './PageMetadata';

export default function ContactPage() {
  return (
    <article className="editorial-home mx-auto w-full max-w-4xl space-y-10" aria-labelledby="contact-heading">
      <PageMetadata
        title="Contact · Core Values"
        description="Ask a question, share an idea or report a problem with Core Values. Find the email address for feedback and privacy requests."
        path="/contact"
      />

      <header className="max-w-[65ch] space-y-6">
        <h1 id="contact-heading" className="text-4xl sm:text-5xl lg:text-6xl">
          A question, an idea, or something that didn’t work?
        </h1>
        <p className="text-lg leading-relaxed">
          If you have a question about the exercise, an idea to share or a problem to report, I’d like to hear from you.
        </p>
        <p className="text-lg leading-relaxed">
          Email{' '}
          <a className="editorial-text-link" href="mailto:corevaluesanalytics@gmail.com">
            corevaluesanalytics@gmail.com
          </a>
          . You can use the same address for privacy questions and requests.
        </p>
      </header>

      <section className="border-t border-[var(--editorial-line)] pt-8" aria-label="Explore the exercise">
        <Link className="editorial-button editorial-button--primary" to="/exercise">
          Find my core values
        </Link>
      </section>
    </article>
  );
}
