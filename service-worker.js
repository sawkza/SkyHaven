// Import Firebase scripts for messaging
importScripts("https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js");

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxQD-mgdlGObPULe6SrkRz2pOIlW0e3qk",
    authDomain: "skyhaven-project.firebaseapp.com",
    projectId: "skyhaven-project",
    storageBucket: "skyhaven-project.appspot.com",
    messagingSenderId: "390818384586",
    appId: "1:390818384586:web:6df306bb9062cfd77a0233",
    measurementId: "G-ZYB43QHF3G",
    vapidKey: "BMlmHQtxNDDZBtOvsgXUfncF92BDk8SKIymFjJwMSEg9ho31b71A3paBzPsBIUII6137I22b5C5sMavVLqGdlsg"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);
    const notificationTitle = payload.notification.title || "Default Title";
    const notificationOptions = {
        body: payload.notification.body || "Default Body",
        icon: '/static/icon-192x192.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

    // Play alert sound on receiving background notification
    const audio = new Audio('/static/alert.mp3');
    audio.play().catch((err) => console.error('Audio play failed:', err));
});

// Add fetch handler
self.addEventListener('fetch', (event) => {
    console.log("Fetch intercepted for:", event.request.url);
});

// Add notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);
    const audio = new Audio('/static/alert.mp3');
    audio.play().catch((err) => console.error('Audio play failed:', err));
    event.notification.close();
});
