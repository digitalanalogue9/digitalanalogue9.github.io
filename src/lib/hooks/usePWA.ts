'use client';

import { useState, useEffect } from 'react';
import { PWAStatus } from "@/lib/types";

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
  const [status, setStatus] = useState<PWAStatus>({
    needsUpdate: false,
    isOffline: false // Default to false, will update in useEffect
  });

  useEffect(() => {
    // Update initial offline status
    setStatus(prev => ({
      ...prev,
      isOffline: !window.navigator.onLine
    }));

    const handleStatusChange = () => {
      setStatus(prevStatus => ({
        ...prevStatus,
        isOffline: !window.navigator.onLine
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
    if (typeof window !== 'undefined' && 'serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('controllerchange', () => {
          setStatus(prevStatus => ({
            ...prevStatus,
            needsUpdate: true
          }));
        });
      });
    }
  }, []);

  const updateServiceWorker = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in window.navigator) {
      const registration = await window.navigator.serviceWorker.ready;
      await registration.update();
      setStatus(prevStatus => ({
        ...prevStatus,
        needsUpdate: false
      }));
      window.location.reload();
    }
  };

  return {
    ...status,
    updateServiceWorker
  };
}
