import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  projectId: config.projectId,
  appId: config.appId,
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, config.firestoreDatabaseId);
export const storage = getStorage(app);

// Suppress internal Firestore logs about idleness/quota in production
setLogLevel('silent');
