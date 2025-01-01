// src/app/error.tsx
'use client';

import { useMobile } from '@/lib/contexts/MobileContext';
import { useEffect, useState } from 'react';

/**
 * Error component to display error messages and provide a way to reset the application state.
 *
 * @param {Object} props - The properties object.
 * @param {Error & { digest?: string }} props.error - The error object containing the error details.
 * @param {() => void} props.reset - The function to reset the application state.
 *
 * @returns {JSX.Element} The rendered error component.
 *
 * @example
 * ```tsx
 * <Error error={new Error('Something went wrong')} reset={() => {}} />
 * ```
 *
 * @remarks
 * This component logs the error details to the console for debugging purposes.
 * In development mode, it displays the error message to the user.
 * It provides a button to attempt to recover from the error and optionally displays an error reference code.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { isMobile } = useMobile();

  useEffect(() => {
    document.title = 'Core Values - Error';
  }, []);

  useEffect(() => {
    // Log error for debugging but ensure no sensitive info is exposed
    console.error('App Error:', {
      message: error.message,
      digest: error.digest,
      name: error.name,
    });
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center p-4" role="alert" aria-labelledby="error-heading">
      <div className="max-w-md text-center">
        <h1 id="error-heading" className="mb-4 text-2xl font-bold">
          Something went wrong!
        </h1>

        <div className="mb-6">
          <p className="mb-2 text-black" aria-live="polite">
            We encountered an unexpected error. You can try again or return to the home page.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <p className="mt-2 text-sm text-red-600" aria-label="Error details">
              {error.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full rounded bg-blue-700 px-4 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Attempt to recover from error"
          >
            Try again
          </button>

          {error.digest && (
            <p className="text-xs text-black" aria-label="Error reference code">
              Error Reference: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
