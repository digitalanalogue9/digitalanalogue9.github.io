// src/components/OfflineIndicator.tsx
'use client';

import { usePWA } from "@/lib/hooks/usePWA";
export default function OfflineIndicator() {
  const {
    isOffline
  } = usePWA();
  if (!isOffline) return null;
  return <div role="alert" aria-live="polite" className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 transform transition-all duration-300 
                bg-yellow-500 text-white px-3 sm:px-4 py-2 sm:py-3 
                text-xs sm:text-sm rounded-lg shadow-lg z-50 
                max-w-[calc(100vw-1rem)] sm:max-w-md">
      <div className="flex items-center space-x-2" aria-label="Offline status indicator">
        <span className="h-2 w-2 bg-white rounded-full animate-pulse" aria-hidden="true" />
        <span className="sr-only">Warning:</span>
        <span>You are offline. Some features may be limited.</span>
      </div>
    </div>;
}