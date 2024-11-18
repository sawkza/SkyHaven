// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

// Your Firebase configuration
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

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Retrieve and log the FCM Registration Token
messaging.getToken({ vapidKey: "BMImHQtxNDDZBtOvsgXUfncF92BDk8SKIymFjJwMSEg9ho31b71A3paBzPsBIUII6137I22b5C5sMavVLqGdlsg" })
    .then((currentToken) => {
        if (currentToken) {
            console.log("FCM Registration Token:", currentToken);
        } else {
            console.log("No registration token available. Request permission to generate one.");
        }
    })
    .catch((error) => {
        console.error("Error retrieving FCM token:", error);
    });

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    // Show notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});
