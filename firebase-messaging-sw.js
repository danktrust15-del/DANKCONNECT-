// DANKCONNECT V14 - Background Push Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDfWReJ-A4J2W5V_FahYjLwfXv3-sNvXZE",
  authDomain: "dankconnect.firebaseapp.com",
  projectId: "dankconnect",
  storageBucket: "dankconnect.firebasestorage.app",
  messagingSenderId: "248906319926",
  appId: "1:248906319926:web:704456ec90628c5f2a7097"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[DANKCONNECT] Background push:', payload);
  const title = payload.notification?.title || 'DANKCONNECT 🇬🇭';
  const options = {
    body: payload.notification?.body || 'New message',
    icon: '/DANKCONNECT/logo.png?v=14',
    badge: '/DANKCONNECT/logo.png?v=14',
    vibrate: [200, 100, 200],
    tag: 'dankconnect-chat'
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/DANKCONNECT/?v=14')
  );
});