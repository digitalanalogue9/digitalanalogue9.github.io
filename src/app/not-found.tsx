// src/app/not-found.tsx
'use client';

import { useMobile } from '@/lib/contexts/MobileContext';
import { getResponsiveTextStyles } from '@/lib/utils/styles/textStyles';
import Link from 'next/link';
// import { Suspense, useEffect, useState } from 'react';

/**
 * NotFound component renders a user-friendly message indicating that the requested page could not be found.
 * It includes a heading, a descriptive message, and a link to return to the homepage.
 *
 * @returns {JSX.Element} A React component that displays a "Page Not Found" message.
 */
export default function NotFound() {
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="text-center" role="alert" aria-labelledby="not-found-title">
        <h1 id="not-found-title" className={`${styles.heading} mb-4 font-bold`}>
          Page Not Found
        </h1>
        <p className={`${styles.paragraph} mb-4 text-black`} aria-live="polite">
          Could not find requested resource
        </p>
        <Link
          href="/"
          className={`${styles.paragraph} inline-flex items-center rounded px-2 py-1 text-blue-700 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
          aria-label="Return to homepage"
        >
          <span aria-hidden="true">←</span>
          <span className="ml-1">Return Home</span>
        </Link>
      </div>
    </div>
  );
}
