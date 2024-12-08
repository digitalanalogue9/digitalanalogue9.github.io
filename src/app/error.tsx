// src/app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging but ensure no sensitive info is exposed
    console.error('App Error:', {
      message: error.message,
      digest: error.digest,
      name: error.name
    })
  }, [error])

  return (
    <main 
      className="flex-1 flex items-center justify-center p-4"
      role="alert"
      aria-labelledby="error-heading"
    >
      <div className="text-center max-w-md">
        <h1 
          id="error-heading"
          className="text-2xl font-bold mb-4"
        >
          Something went wrong!
        </h1>
        
        <div className="mb-6">
          <p 
            className="text-gray-700 mb-2"
            aria-live="polite"
          >
            We encountered an unexpected error. 
            You can try again or return to the home page.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <p 
              className="text-red-600 text-sm mt-2"
              aria-label="Error details"
            >
              {error.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Attempt to recover from error"
          >
            Try again
          </button>
          
          {error.digest && (
            <p 
              className="text-xs text-gray-500"
              aria-label="Error reference code"
            >
              Error Reference: {error.digest}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
