// src/app/not-found.tsx
'use client'

import Link from 'next/link';

export default function NotFound() {
  return (
    <div 
      className="flex-1 flex items-center justify-center p-4"
      role="main"
    >      <div 
        className="text-center"
        role="alert"
        aria-labelledby="not-found-title"
      >
        <h1 
          id="not-found-title"
          className="text-2xl font-bold mb-4"
        >
          Page Not Found
        </h1>
        <p 
          className="mb-4 text-black"
          aria-live="polite"
        >
          Could not find requested resource
        </p>
        <Link 
          href="/"
          className="text-blue-700 hover:text-blue-800 underline inline-flex items-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1"
          aria-label="Return to homepage"
        >
          <span aria-hidden="true">←</span>
          <span className="ml-1">Return Home</span>
        </Link>
      </div>
    </div>
  );
}
