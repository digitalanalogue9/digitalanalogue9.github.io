'use client';
import { usePWA } from '@/lib/hooks/usePWA';
/**
 * OfflineIndicator component displays a notification when the user is offline.
 * It uses the `usePWA` hook to determine the offline status.
 *
 * @component
 * @example
 * // Usage example:
 * // import OfflineIndicator from '@/components/common/OfflineIndicator';
 * //
 * // function App() {
 * //   return (
 * //     <div>
 * //       <OfflineIndicator />
 * //     </div>
 * //   );
 * // }
 *
 * @returns {JSX.Element | null} A JSX element displaying the offline notification or null if online.
 */
// src/components/OfflineIndicator.tsx
export default function OfflineIndicator() {
  const { isOffline } = usePWA();
  if (!isOffline) return null;
  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-2 left-2 z-50 max-w-[calc(100vw-1rem)] transform rounded-lg bg-yellow-500 px-3 py-2 text-xs text-white shadow-lg transition-all duration-300 sm:bottom-4 sm:left-4 sm:max-w-md sm:px-4 sm:py-3 sm:text-sm"
    >
      <div className="flex items-center space-x-2" aria-label="Offline status indicator">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden="true" />
        <span className="sr-only">Warning:</span>
        <span>You are offline. Some features may be limited.</span>
      </div>
    </div>
  );
}
