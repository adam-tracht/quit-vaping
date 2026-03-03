const CACHE_NAME = 'quit-vaping-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

// Scheduled notifications storage (in-memory, cleared on SW restart)
let scheduledNotifications = new Map();

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const notification = event.data.notification;
    scheduleNotification(notification);
  } else if (event.data && event.data.type === 'CLEAR_NOTIFICATION') {
    const tag = event.data.tag;
    clearScheduledNotification(tag);
  }
});

// Schedule a notification
function scheduleNotification(notification) {
  const [hours, minutes] = notification.time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  // Clear existing timeout for this tag
  if (scheduledNotifications.has(notification.tag)) {
    clearTimeout(scheduledNotifications.get(notification.tag));
  }

  // Schedule new timeout
  const timeoutId = setTimeout(() => {
    showNotification(notification);
    // Reschedule for next day
    scheduleNotification(notification);
  }, delay);

  scheduledNotifications.set(notification.tag, timeoutId);
}

// Clear a scheduled notification
function clearScheduledNotification(tag) {
  if (scheduledNotifications.has(tag)) {
    clearTimeout(scheduledNotifications.get(tag));
    scheduledNotifications.delete(tag);
  }
}

// Show a notification
function showNotification(notification) {
  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: notification.tag,
    requireInteraction: false,
    silent: false,
  });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === self.location.origin && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if no existing window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle push event (for future web push implementation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title || 'Quit Vaping', {
      body: data.body || 'You have a new reminder',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'push-notification',
    });
  }
});
