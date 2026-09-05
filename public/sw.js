// Minimal service worker: enables "Add to Home Screen" / installability.
// The directory is live data, so we deliberately do not cache API/page
// responses - every visit should show the latest information.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // no-op: always go to the network
});
