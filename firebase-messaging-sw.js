// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxQD-mgdlGObPULe6SrkRz2pOIlW0e3qk",
    authDomain: "skyhaven-project.firebaseapp.com",
    projectId: "skyhaven-project",
    storageBucket: "skyhaven-project.appspot.com",
    messagingSenderId: "390818384586",
    appId: "1:390818384586:web:6df306bb9062cfd77a0233",
    measurementId: "G-ZYB43QHF3G",
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
        icon: payload.notification.icon || '/static/icon-192x192.png',
        image: payload.notification.image, // Include image from payload if available
    };

    // Play sound if "playSound" key exists in the data payload
    if (payload.data?.playSound) {
        const audio = new Audio(payload.data.playSound);
        audio.play().catch((err) => console.error("Audio play failed:", err));
    }

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Add a fetch handler
self.addEventListener('fetch', (event) => {
    console.log("Fetch intercepted for:", event.request.url);
});

// Add a notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);

    // Play alert sound on notification click
    const audio = new Audio('/static/alert.mp3');
    audio.play().catch((err) => console.error('Audio play failed:', err));

    event.notification.close(); // Close the notification
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});
