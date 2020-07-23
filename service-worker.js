const APP_PREFIX = 'FoodFest-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
  ];

self.addEventListener('install', function (e) {
    // We use e.waitUntil to tell the browser to wait until the work is complete before terminating the service worker
    // This ensures that the service worker doesn't move on from the installing phase until it's finished executing all of its code
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        // .keys() returns an array of all cache names, which we're calling keyList.
      caches.keys().then(function (keyList) {
          // keyList is a parameter that contains all cache names under <username>.github.io
          //  filter out caches that have the app prefix.
          // capture the ones that have that prefix, stored in APP_PREFIX, and save them to an array called cacheKeeplist using the .filter() method
        let cacheKeeplist = keyList.filter(function (key) {
          return key.indexOf(APP_PREFIX);
        });
          cacheKeeplist.push(CACHE_NAME);

          return Promise.all(
            keyList.map(function(key, i) {
              if (cacheKeeplist.indexOf(key) === -1) {
                console.log('deleting cache : ' + keyList[i]);
                return caches.delete(keyList[i]);
              }
            })
          );
        })
      );
    });

self.addEventListener('fetch', function (e) {
    console.log('fetch request " ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { // if cache is available, respond with cache
                console.log('responding with cache : ' + e.request.url)
                return request
            } else { // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    )
});