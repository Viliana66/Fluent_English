const CACHE="fluent-english-v5";
const ASSETS=["./","./index.html","./content.js","./course.js","./manifest.webmanifest"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("fetch",event=>{
  event.respondWith(
    fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(c=>c.put(event.request,copy));
      return response;
    }).catch(()=>caches.match(event.request))
  );
});
