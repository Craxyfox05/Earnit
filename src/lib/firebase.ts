import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb7gzV_lnLrTszzv7R2Tnk4kwFD2qLntU",
  authDomain: "earnit-186b9.firebaseapp.com",
  projectId: "earnit-186b9",
  storageBucket: "earnit-186b9.firebasestorage.app",
  messagingSenderId: "905185903535",
  appId: "1:905185903535:web:45d4152ef8620b64db255a"
};

// Initialize Firebase - ensure only one instance is created
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const storage = getStorage(app);

export { app, db, auth, functions, storage }; 