const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key file
const serviceAccount = path.join(__dirname, './config/key.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Export Firestore instance
const firestore = admin.firestore();

module.exports = firestore;
