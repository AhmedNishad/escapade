const CACHE_NAME = 'static_cache'

const static_assets = [
    './index.html',
    './style.css',
    './bundle.js',
    './escapade_fav.png',
    './bulma.min.css'
]
self.addEventListener('install',function(e){
    self.skipWaiting()
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then( cache => {
            console.log("Cache opened")
            return cache.addAll(static_assets)
        })
    )
})

self.addEventListener('fetch', event => {
    //console.log(event)
    /* event.respondWith(
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request);
        }).catch(e => console.log(e))
      ); */
      
      event.respondWith(async function() {
        try {
          return await fetch(event.request);
        } catch (err) {
            let urlArr = event.request.url.split('/')
            console.log(urlArr)
            if(urlArr.length > 3 && (urlArr[2] == '127.0.0.1:5501' || urlArr[2] == 'escapade-69098.firebaseapp.com'
            || urlArr[2] == 'escapade-69098.web.app')){
                event.request.url = event.target.origin
                console.log("This is already present")
      }
          return caches.match(event.request);
        }
      }());
})

/* navigator.serviceWorker.register('/service-worker.js', {
    scope: '/public/'
  }); */