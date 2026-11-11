import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { nonExercisePageContainerClassName } from '@/app/layoutClasses';

const actionLinkClassName =
  'inline-flex min-h-11 items-center justify-center rounded-sys-radius-button-sm px-4 py-2 font-sans text-interface-base-small font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ref-color-brand-primary';

export function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <section
        className="rounded-sys-radius-card border-ref-color-brand-surface-primary bg-sys-color-surface-light w-full max-w-2xl border p-6 sm:p-10"
        aria-labelledby="not-found-title"
      >
        <h1 className="text-interface-title-1 text-ref-color-neutral-black font-sans font-bold" id="not-found-title">
          We couldn’t find that page
        </h1>
        <p className="text-interface-base text-ref-color-neutral-black mt-4 max-w-prose font-sans leading-relaxed">
          The address may be out of date or mistyped. You can return home or open your saved exercises.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            className={`${actionLinkClassName} bg-ref-color-brand-primary hover:bg-ref-color-brand-primary-hover text-white`}
            to="/"
          >
            Go to home
          </Link>
          <Link
            className={`${actionLinkClassName} border-ref-color-brand-primary text-ref-color-brand-primary hover:bg-ref-color-brand-surface-primary border underline underline-offset-4`}
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
    <div className={`${nonExercisePageContainerClassName} app-page-panel my-10 space-y-8`}>
      <section role="alert" aria-labelledby="route-error-title">
        <h1 className="page-heading text-4xl sm:text-5xl lg:text-6xl" id="route-error-title">
          {notFound ? 'We couldn’t find that page' : 'This page ran into a problem'}
        </h1>
        <p className="page-intro max-w-[70ch]">
          {notFound
            ? 'The address may be out of date or mistyped. Return home or open your saved exercises.'
            : 'The page could not finish loading. You can try again or open your saved exercises.'}
        </p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          {!notFound && (
            <button
              className={`${actionLinkClassName} bg-ref-color-brand-primary hover:bg-ref-color-brand-primary-hover cursor-pointer border-0 text-white`}
              onClick={() => window.location.reload()}
              type="button"
            >
              Try again
            </button>
          )}
          <Link
            className={`${actionLinkClassName} ${notFound ? 'bg-ref-color-brand-primary hover:bg-ref-color-brand-primary-hover text-white' : 'border-ref-color-brand-primary text-ref-color-brand-primary hover:bg-ref-color-brand-surface-primary border underline underline-offset-4'}`}
            to="/history"
          >
            Open saved exercises
          </Link>
        </div>
      </section>
    </div>
  );
}
