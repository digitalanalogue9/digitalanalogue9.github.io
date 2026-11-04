import PageMetadata from './PageMetadata';

export default function ContactPage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-4 p-4" aria-labelledby="contact-heading">
      <PageMetadata
        title="Contact Core Values"
        description="Contact the Core Values site owner with questions, feedback, or privacy requests."
        path="/contact"
      />
      <h1 id="contact-heading" className="text-center text-3xl font-bold">
        Contact
      </h1>
      <p>
        For questions, feedback, or privacy requests, email{' '}
        <a className="text-blue-700 underline" href="mailto:corevaluesanalytics@gmail.com">
          corevaluesanalytics@gmail.com
        </a>
        .
      </p>
    </article>
  );
}
