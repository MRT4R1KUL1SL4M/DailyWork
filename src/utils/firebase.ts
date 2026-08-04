import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { AppData } from '../types';

// User's active Firebase Project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCObIqzDPnU3YcRXVirSzjkUvQFibb2Lfc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dailywork-93ea5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dailywork-93ea5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dailywork-93ea5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "402670206216",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:402670206216:web:f6a014d5199b9a673880bd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-M976L0WBS3"
};

// Check if valid Firebase configuration keys are provided
export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

// Initialize Firebase App & Firestore safely
let db: any = null;

if (isFirebaseConfigured()) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log('⚡ Firebase Firestore Cloud DB connected successfully!');
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
}

const DOCUMENT_PATH = ['dailywork_notebook', 'personal_data'] as const;

// Save AppData to Firebase Firestore
export const saveAppDataToFirebase = async (data: AppData): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  try {
    const docRef = doc(db, DOCUMENT_PATH[0], DOCUMENT_PATH[1]);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    console.error('Failed to sync to Firebase Firestore:', err);
  }
};

// Subscribe to Real-Time Updates from Firebase Firestore
export const subscribeAppDataFromFirebase = (
  onUpdate: (data: AppData) => void
): (() => void) => {
  if (!db || !isFirebaseConfigured()) return () => {};

  try {
    const docRef = doc(db, DOCUMENT_PATH[0], DOCUMENT_PATH[1]);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as AppData;
          if (remoteData && Array.isArray(remoteData.tasks)) {
            onUpdate(remoteData);
          }
        }
      },
      (err) => {
        console.warn('Firestore subscription notice (rules check):', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to Firebase Firestore:', err);
    return () => {};
  }
};
