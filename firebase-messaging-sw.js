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
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);

    // Post message to main thread for audio playback
    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        if (clients && clients.length) {
            clients.forEach((client) =>
                client.postMessage({
                    type: "PLAY_SOUND",
                    sound: '/static/alert.mp3', // Use the alert sound
                })
            );
        }
    });

    const notificationTitle = payload.notification.title || "Default Title";
    const notificationOptions = {
        body: payload.notification.body || "Default Body",
        icon: payload.notification.icon || '/static/icon-192x192.png',
        image: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Push event listener for notifications
self.addEventListener('push', (event) => {
    console.log('Push event received:', event.data?.json());
    const payload = event.data?.json();

    if (payload) {
        console.log('Notification payload:', payload);

        // Send a message to the main thread to play the sound
        self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    type: 'PLAY_SOUND',
                    sound: '/static/alert.mp3',
                });
            });
        });

        // Show the notification
        const notificationTitle = payload.notification.title || 'Default Title';
        const notificationOptions = {
            body: payload.notification.body || 'Default Body',
            icon: payload.notification.icon || '/static/icon-192x192.png',
            image: payload.notification.image,
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
    } else {
        console.warn('Push event did not contain any data');
    }
});

// Add a fetch handler for debugging
self.addEventListener('fetch', (event) => {
    console.log("Fetch intercepted for:", event.request.url);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);
    const audio = new Audio('/static/alert.mp3');
    audio.play().catch((err) => console.error('Audio play failed:', err));
    event.notification.close();
});
