const admin = require('firebase-admin');
const serviceAccount = require('./skyhaven-project-7e626753c6cf.json');

// Initialize the Firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Define the message payload
const message = {
  notification: {
    title: 'Hello, World!',
    body: 'This is a test notification from FCM.'
  },
  token: 'BMlmHQtxNDDZBtOvsgXUfncF92BDk8SKIymFjJwMSEg9ho31b71A3paBzPsBIUII6137I22b5C5sMavVLqGdlsg' // Replace with the actual device token
};

// Send the notification
admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });
