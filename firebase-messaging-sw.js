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
        icon: '/static/icon-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
