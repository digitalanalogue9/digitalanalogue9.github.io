// src/utils/cache.ts
export const forceReload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (const registration of registrations) {
        registration.unregister();
      }
      window.location.reload();
    });
  } else {
    window.location.reload();
  }
};
