// Minimal service worker — satisfies PWA installability requirement.
// No caching strategy; all requests pass through to the network.
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
