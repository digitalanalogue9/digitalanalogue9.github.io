import PageMetadata from './PageMetadata';

export default function ContactPage() {
  return (
    <article className="app-page-panel mx-auto max-w-3xl space-y-5" aria-labelledby="contact-heading">
      <PageMetadata
        title="Contact Core Values"
        description="Contact the Core Values site owner with questions, feedback, or privacy requests."
        path="/contact"
      />
      <h1 id="contact-heading" className="text-interface-title-1 text-center font-semibold">
        Contact
      </h1>
      <p>
        For questions, feedback, or privacy requests, email{' '}
        <a
          className="text-ref-color-brand-primary underline underline-offset-4"
          href="mailto:corevaluesanalytics@gmail.com"
        >
          corevaluesanalytics@gmail.com
        </a>
        .
      </p>
    </article>
  );
}
