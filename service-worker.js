self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  // Cache static assets here if necessary
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
});

self.addEventListener('fetch', event => {
  // Intercept network requests (optional)
});
