// Extend the existing Window interface
interface Window {
  workbox: unknown;
}

// Define ServiceWorkerGlobalScope
interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  __WB_MANIFEST: unknown[];
  skipWaiting(): Promise<void>;
  clients: Clients;
}
