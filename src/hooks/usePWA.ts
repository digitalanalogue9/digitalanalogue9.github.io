import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  needsUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
  updateWorker: ServiceWorker | null;
}

interface UsePWAReturn extends PWAStatus {
  installPWA: () => Promise<void>;
  updateServiceWorker: () => Promise<void>;
  registerSync: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
}

export const usePWA = (): UsePWAReturn => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    needsUpdate: false,
    registration: null,
    updateWorker: null
  });

  // Check if the app is installed
  const checkInstallationStatus = useCallback(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = isStandalone || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setStatus(prev => ({ ...prev, isInstalled }));
  }, []);

  // Handle online/offline status
  const handleOnlineStatus = useCallback(() => {
    setStatus(prev => ({ ...prev, isOffline: !navigator.onLine }));
  }, []);

  // Check for service worker updates
  const checkForUpdates = useCallback(async () => {
    if (status.registration) {
      try {
        await status.registration.update();
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }
  }, [status.registration]);

  // Setup periodic update checks
  useEffect(() => {
    if (status.registration) {
      const interval = setInterval(checkForUpdates, 1000 * 60 * 60); // Check every hour
      return () => clearInterval(interval);
    }
  }, [status.registration, checkForUpdates]);

  // Main PWA setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    checkInstallationStatus();
    handleOnlineStatus();

    // Event listeners for online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkInstallationStatus);

    // Handle installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setStatus(prev => ({ ...prev, isInstallable: true }));
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
    });

    // Service Worker registration and update handling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          setStatus(prev => ({ ...prev, registration }));

          // Watch for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    setStatus(prev => ({ 
                      ...prev, 
                      needsUpdate: true,
                      updateWorker: newWorker
                    }));
                  }
                }
              });
            }
          });

          // Handle controller changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (status.needsUpdate) {
              window.location.reload();
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkInstallationStatus);
    };
  }, [checkInstallationStatus, handleOnlineStatus]);

  // Install PWA
  const installPWA = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  // Update Service Worker
  const updateServiceWorker = async () => {
    if (status.updateWorker) {
      status.updateWorker.postMessage({ type: 'SKIP_WAITING' });
    } else if (status.registration) {
      try {
        await status.registration.update();
        window.location.reload();
      } catch (error) {
        console.error('Error updating service worker:', error);
      }
    }
  };

  // Register background sync
  const registerSync = async () => {
    if (!status.registration) return;

    try {
      if ('sync' in status.registration) {
        await status.registration.sync.register('syncGameState');
      } else if ('periodicSync' in status.registration) {
        // Register periodic sync as fallback
        const periodicSync = (status.registration as any).periodicSync;
        await periodicSync.register('syncGameState', {
          minInterval: 24 * 60 * 60 * 1000 // 24 hours
        });
      }
    } catch (error) {
      console.error('Error registering sync:', error);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    return false;
  };

  return {
    ...status,
    installPWA,
    updateServiceWorker,
    registerSync,
    checkForUpdates
  };
};
