const admin = require('firebase-admin');
const serviceAccount = require('./firebase_key.json'); // Correct path to the JSON file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin SDK initialized successfully.');
