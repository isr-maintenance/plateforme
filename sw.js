/* Hors connexion : l'app (pas les données) reste disponible. Le réseau a toujours la priorité,
   en revalidant chaque fichier : une mise à jour publiée est visible au rechargement suivant. */
const CACHE='plateforme-v2';
const FILES=['./','index.html','css/styles.css?v=1','js/config.js?v=1','js/catalog.js?v=1','js/api-core.js?v=1','js/api.js?v=1','js/relais.js?v=1','js/core.js?v=1','js/pages.js?v=1','js/pages-prof.js?v=1','manifest.webmanifest','icons/icon.svg','icons/icon-192.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==location.origin) return;     // les appels au serveur Google ne passent pas par le cache
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request)));
});
