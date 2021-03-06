/* eslint no-restricted-globals: 0 */
/* eslint no-undef: 0 */
/* eslint no-useless-escape: 0 */

(function () {
  if (typeof importScripts !== 'function') {
    console.warn('ImportScripts not available. Cannot start service worker');
    return;
  }

  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js'
  );

  const { workbox } = this;

  if (!workbox) {
    console.warn('Workbox could not be loaded. Aborting SW setup');
    return;
  }

  workbox.core.setCacheNameDetails({
    prefix: 'cyoa',
    suffix: '1.0.0',
  });

  /* injection point for manifest files.  */
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  /* respond with index.html on every navigation request */
  const handler = workbox.precaching.createHandlerBoundToURL('/index.html');
  const navRoute = new workbox.routing.NavigationRoute(handler);
  workbox.routing.registerRoute(navRoute);

  const matchCb = ({ url }) => {
    return [
      '/tag',
      '/public/story',
    ].includes(url.pathname);
  };

  workbox.routing.registerRoute(
    matchCb,
    new workbox.strategies.StaleWhileRevalidate()
  );

  configureGoogleCache (workbox);

  // if (isLocalhost) {
  //   setupBasicEventListeners();
  // }
})();

function configureGoogleCache (workbox) {
  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
    })
  );
}

function setupBasicEventListeners () {
  self.addEventListener('install', () => {
    console.log('[SW]: Installed');
  });

  self.addEventListener('activate', () => {
    console.log('[SW]: Activated');
  });

  self.addEventListener('fetch', (event) => {
    console.log('[SW]: ', event);
    return fetch(event.request);
  });
}
