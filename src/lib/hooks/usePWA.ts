'use client';

import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { PWAStatus } from '../types';

/**
 * Custom hook to manage Progressive Web App (PWA) status.
 *
 * This hook provides the current status of the PWA, including whether it needs an update
 * and whether the application is offline. It also provides a method to update the service worker.
 *
 * @returns {Object} An object containing:
 * - `needsUpdate` (boolean): Indicates if the service worker needs an update.
 * - `isOffline` (boolean): Indicates if the application is currently offline.
 * - `updateServiceWorker` (function): A function to manually update the service worker and reload the page.
 *
 * @example
 * const { needsUpdate, isOffline, updateServiceWorker } = usePWA();
 *
 * useEffect(() => {
 *   if (needsUpdate) {
 *     // Notify the user about the update
 *   }
 * }, [needsUpdate]);
 *
 * useEffect(() => {
 *   if (isOffline) {
 *     // Handle offline status
 *   }
 * }, [isOffline]);
 */
export function usePWA() {
  const {
    needRefresh: [needsUpdate],
    updateServiceWorker: triggerServiceWorkerUpdate,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('Service worker registration error:', error);
    },
  });
  const [status, setStatus] = useState<PWAStatus>({
    needsUpdate: false,
    isOffline: false, // Default to false, will update in useEffect
  });

  useEffect(() => {
    // Update initial offline status
    setStatus((prev) => ({
      ...prev,
      isOffline: !window.navigator.onLine,
    }));

    const handleStatusChange = () => {
      setStatus((prevStatus) => ({
        ...prevStatus,
        isOffline: !window.navigator.onLine,
      }));
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    setStatus((prevStatus) => ({ ...prevStatus, needsUpdate }));
  }, [needsUpdate]);

  const updateServiceWorker = async () => {
    await triggerServiceWorkerUpdate(true);
    setStatus((prevStatus) => ({ ...prevStatus, needsUpdate: false }));
  };

  return {
    ...status,
    updateServiceWorker,
  };
}
