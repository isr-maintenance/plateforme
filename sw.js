/* Hors connexion : l'app (pas les données) reste disponible. Le réseau a toujours la priorité,
   en revalidant chaque fichier : une mise à jour publiée est visible au rechargement suivant. */
const CACHE='plateforme-v17';
const FILES=['./','index.html','css/styles.css?v=5','js/config.js?v=2','js/catalog.js?v=3','js/api-core.js?v=2','js/api.js?v=1','js/relais.js?v=2','js/chapitres.js?v=5','js/chap21.js?v=1','js/chap22.js?v=1','js/chap24.js?v=1','js/chap25.js?v=1','js/chap26.js?v=1','js/chap27.js?v=1','js/chap28.js?v=1','js/chap29.js?v=1','js/chap210.js?v=1','js/chap211.js?v=1','js/formules.js?v=3','js/af3.js?v=2','js/af3-1.js?v=3','js/af3-2.js?v=2','js/af3-3.js?v=1','js/af3-4.js?v=1','js/af3-series.js?v=1','js/core.js?v=9','js/pages.js?v=6','js/pages-prof.js?v=5','manifest.webmanifest','icons/icon.svg','icons/icon-192.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==location.origin) return;     // les appels au serveur Google ne passent pas par le cache
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request)));
});
