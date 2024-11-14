// Import Firebase scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase with your Messaging Sender ID
firebase.initializeApp({
  messagingSenderId: '390818384586', // Replace with your actual sender ID from Firebase
});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Add your VAPID key for browser authorization
messaging.getToken({ vapidKey: 'BMlmHQtxNDDZBtOvsgXUfncF92BDk8SKIymFjJwMSEg9ho31b71A3paBzPsBIUII6137I22b5C5sMavVLqGdlsg' });

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/static/icon-192x192.png' // Update the icon path if necessary
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
