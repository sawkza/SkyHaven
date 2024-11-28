// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

// Firebase configuration (same as in your HTML file)
const firebaseConfig = {
    apiKey: "AIzaSyCxQD-mgdlGObPULe6SrkRz2pOIlW0e3qk",
    authDomain: "skyhaven-project.firebaseapp.com",
    projectId: "skyhaven-project",
    storageBucket: "skyhaven-project.appspot.com",
    messagingSenderId: "390818384586",
    appId: "1:390818384586:web:6df306bb9062cfd77a0233",
    measurementId: "G-ZYB43QHF3G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title || 'Default Title';
    const notificationOptions = {
        body: payload.notification.body || 'Default Body',
        icon: payload.notification.icon || '/static/icon-192x192.png', // Fallback to default icon
        image: payload.data?.image || 'https://picsum.photos/200/300', // Handle custom image via data
    };

    // Fetch alert.mp3 to ensure it is loaded
    fetch('/static/alert.mp3')
        .then(() => {
            // Play alert sound
            const audio = new Audio('/static/alert.mp3');
            audio.play().catch((err) => console.warn('Audio play failed:', err));
        })
        .catch((err) => console.warn('Failed to fetch alert.mp3:', err));

    // Display the notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Ensure `push` event is handled correctly
self.addEventListener('push', (event) => {
    console.log('Push event received:', event.data?.json());

    const data = event.data?.json() || {};
    const notificationTitle = data.notification?.title || 'Default Push Title';
    const notificationOptions = {
        body: data.notification?.body || 'Default Push Body',
        icon: data.notification?.icon || '/static/icon-192x192.png',
    };

    // Fetch alert.mp3 during push event
    fetch('/static/alert.mp3')
        .then(() => {
            // Play alert sound
            const audio = new Audio('/static/alert.mp3');
            audio.play().catch((err) => console.warn('Audio play failed:', err));
        })
        .catch((err) => console.warn('Failed to fetch alert.mp3:', err));

    self.registration.showNotification(notificationTitle, notificationOptions);
});
