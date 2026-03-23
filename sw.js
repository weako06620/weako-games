// TERRA sw.js v0.5.0 — Cache désactivé pendant le développement
// Le SW s'enregistre mais ne cache rien pour éviter les problèmes de version

const CACHE = 'terra-v5';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Supprimer TOUS les anciens caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        console.log('Suppression cache:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// Réseau uniquement — pas de cache
self.addEventListener('fetch', e => {
  // Laisser passer toutes les requêtes vers le réseau
  return;
});
