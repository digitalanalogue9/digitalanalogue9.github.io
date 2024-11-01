export const cacheUtils = {
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cache = await caches.open('core-values-dynamic-v1');
      const response = await cache.match(`/api/${key}`);
      if (response) {
        return response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  },

  async setCachedData<T>(key: string, data: T): Promise<void> {
    try {
      const cache = await caches.open('core-values-dynamic-v1');
      const response = new Response(JSON.stringify(data));
      await cache.put(`/api/${key}`, response);
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  },

  async clearCache(): Promise<void> {
    try {
      const cache = await caches.open('core-values-dynamic-v1');
      await cache.keys().then(keys => {
        keys.forEach(key => {
          cache.delete(key);
        });
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};
