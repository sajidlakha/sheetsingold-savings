// SheetsInGold Savings Challenge: offline cache of the app's own files. It never stores or sends your savings data. Bump VERSION to ship an update.
const VERSION = 'sig-savings-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-192.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon-32.png', './fonts/Montserrat-400-latin.woff2', './fonts/Montserrat-400-latin-ext.woff2', './fonts/PlayfairDisplay-600-latin.woff2', './fonts/PlayfairDisplay-600-latin-ext.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('sig-savings-') && k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;   // only this app's own files
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match('./index.html'))));
});
