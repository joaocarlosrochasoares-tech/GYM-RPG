const C='gymrpg-v4',A=['./','index.html','media.js','manifest.json','icon-192.png','icon-512.png'],CDN=['cdn.tailwindcss.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
 if(u.origin===location.origin){
  /* media.js (pesado, muda raramente): abre logo da cache e atualiza em segundo plano */
  if(u.pathname.endsWith('/media.js')){e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>m);return m||n}));return}
  /* resto: tenta a rede primeiro (para receberes as atualizações) e usa a cache se estiveres offline */
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
 if(CDN.includes(u.hostname)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))}});
