import { useState, useEffect } from 'react';
import { initDB } from '@/lib/db/indexedDB';

export function useHistoryInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      }
    };

    initialize();
  }, []);

  return { isInitialized, error };
}
