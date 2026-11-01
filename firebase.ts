import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyDuBF5py1eYhtHIUQRvS1V-eS4Bghq_yXQ",
  authDomain: "my-web-f1f03.firebaseapp.com",
  databaseURL: "https://my-web-f1f03-default-rtdb.firebaseio.com",
  projectId: "my-web-f1f03",
  storageBucket: "my-web-f1f03.firebasestorage.app",
  messagingSenderId: "110000197657",
  appId: "1:110000197657:web:8854e6d8b14842c8fc9a88",
  measurementId: "G-T46Z8BWH2W"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
