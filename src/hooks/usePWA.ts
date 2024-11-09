import { useState, useEffect } from 'react';

interface PWAStatus {
  needsUpdate: boolean;
  isOffline: boolean;
}

export function usePWA() {
  const [status, setStatus] = useState<PWAStatus>({
    needsUpdate: false,
    isOffline: !navigator.onLine
  });

  useEffect(() => {
    const handleStatusChange = () => {
      setStatus(prevStatus => ({
        ...prevStatus,
        isOffline: !navigator.onLine
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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
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
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
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
