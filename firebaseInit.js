const admin = require('firebase-admin');
const serviceAccount = require('./skyhaven-project-7e626753c6cf.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin SDK initialized successfully.');
