import * as admin from 'firebase-admin';

const serviceAccount = require("../secrets/firebase-admin.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = app.firestore();