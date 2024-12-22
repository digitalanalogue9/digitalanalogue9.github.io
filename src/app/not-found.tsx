// src/app/not-found.tsx
'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * NotFound component renders a user-friendly message indicating that the requested page could not be found.
 * It includes a heading, a descriptive message, and a link to return to the homepage.
 *
 * @returns {JSX.Element} A React component that displays a "Page Not Found" message.
 */
export default function NotFound() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      // Initial check
      checkMobile();
  
      // Add event listener for window resizing
      window.addEventListener('resize', checkMobile);
  
      // Cleanup event listener
      return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
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
