const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;

const getFirebaseApp = () => {
  if (firebaseApp) return firebaseApp;

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    logger.warn('Firebase credentials not configured — push notifications disabled.');
    return null;
  }

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    logger.info('Firebase Admin SDK initialised.');
    return firebaseApp;

  } catch (error) {
    logger.error(`Firebase init error: ${error.message}`);
    return null;
  }
};

module.exports = { getFirebaseApp };
