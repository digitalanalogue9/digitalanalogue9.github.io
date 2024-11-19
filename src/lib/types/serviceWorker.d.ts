// Extend the existing Window interface
interface Window {
  workbox: any;
}

// Define ServiceWorkerGlobalScope
interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  __WB_MANIFEST: any[];
  skipWaiting(): Promise<void>;
  clients: Clients;
}
