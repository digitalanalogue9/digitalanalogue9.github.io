import CoreValuesLogoMark from '@/components/common/Navigation/CoreValuesLogoMark';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

const actionLinkClassName =
  'inline-flex min-h-11 items-center justify-center rounded-sys-radius-button-sm px-4 py-2 font-sans text-interface-base-small font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ref-color-brand-primary';

export function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <section
        className="w-full max-w-2xl rounded-sys-radius-card border border-ref-color-brand-surface-primary bg-sys-color-surface-light p-6 sm:p-10"
        aria-labelledby="not-found-title"
      >
        <h1
          className="text-interface-title-1 font-sans font-bold text-ref-color-neutral-black"
          id="not-found-title"
        >
          We couldn’t find that page
        </h1>
        <p className="mt-4 max-w-prose text-interface-base font-sans leading-relaxed text-ref-color-neutral-black">
          The address may be out of date or mistyped. You can return home or open your saved exercises.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            className={`${actionLinkClassName} bg-ref-color-brand-primary text-white hover:bg-ref-color-brand-primary-hover`}
            to="/"
          >
            Go to home
          </Link>
          <Link
            className={`${actionLinkClassName} border border-ref-color-brand-primary text-ref-color-brand-primary underline underline-offset-4 hover:bg-ref-color-brand-surface-primary`}
            to="/history"
          >
            Open saved exercises
          </Link>
        </div>
      </section>
    </div>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="core-values-error-background flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section
        className="w-full max-w-xl rounded-sys-radius-card border border-ref-color-brand-surface-primary bg-sys-color-surface-light p-6 sm:p-10"
        role="alert"
        aria-labelledby="route-error-title"
      >
        <Link
          className="inline-flex min-h-11 items-center gap-3 rounded-sys-radius-button-sm font-sans font-bold text-ref-color-brand-primary no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ref-color-brand-primary"
          to="/"
          aria-label="Core Values home"
        >
          <CoreValuesLogoMark className="h-9 w-9 flex-shrink-0" />
          <span>Core Values</span>
        </Link>
        <h1
          className="mt-8 text-interface-title-1 font-sans font-bold text-ref-color-neutral-black"
          id="route-error-title"
        >
          {notFound ? 'We couldn’t find that page' : 'This page ran into a problem'}
        </h1>
        <p className="mt-4 max-w-prose text-interface-base font-sans leading-relaxed text-ref-color-neutral-black">
          {notFound
            ? 'The address may be out of date or mistyped. Return home or open your saved exercises.'
            : 'The page could not finish loading. You can try again or open your saved exercises.'}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {!notFound && (
            <button
              className={`${actionLinkClassName} cursor-pointer border-0 bg-ref-color-brand-primary text-white hover:bg-ref-color-brand-primary-hover`}
              onClick={() => window.location.reload()}
              type="button"
            >
              Try again
            </button>
          )}
          <Link
            className={`${actionLinkClassName} ${notFound ? 'bg-ref-color-brand-primary text-white hover:bg-ref-color-brand-primary-hover' : 'border border-ref-color-brand-primary text-ref-color-brand-primary underline underline-offset-4 hover:bg-ref-color-brand-surface-primary'}`}
            to="/history"
          >
            Open saved exercises
          </Link>
        </div>
      </section>
    </main>
  );
}
