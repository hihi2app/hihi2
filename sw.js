// Service Worker for PWA functionality
const CACHE_NAME = 'myapp-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/images/logo.png',
    '/images/app-mockup.png',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline downloads
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-download') {
        event.waitUntil(doBackgroundDownload());
    }
});

function doBackgroundDownload() {
    // Handle background download when connection is restored
    return fetch('/api/download-stats', {
        method: 'POST',
        body: JSON.stringify({
            timestamp: Date.now(),
            action: 'download_attempt'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(function(error) {
        console.log('Background sync failed:', error);
    });
}

// Push notifications (if needed)
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'تحديث جديد متوفر!',
        icon: '/images/icon-192x192.png',
        badge: '/images/icon-72x72.png',
        dir: 'rtl',
        lang: 'ar'
    };

    event.waitUntil(
        self.registration.showNotification('تطبيقي', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
