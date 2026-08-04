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
    // Firestore JS SDK rejects object keys with undefined values.
    // JSON serialization cleanly removes all undefined properties.
    const sanitizedData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, sanitizedData, { merge: true });
    console.log('⚡ Firebase sync completed successfully!');
  } catch (err) {
    console.error('Failed to sync to Firebase Firestore:', err);
    throw err;
  }
};

// Subscribe to Real-Time Updates from Firebase Firestore
export const subscribeAppDataFromFirebase = (
  onUpdate: (data: AppData) => void,
  onInitialEmpty?: () => void,
  onError?: (err: any) => void
): (() => void) => {
  if (!db || !isFirebaseConfigured()) return () => {};

  try {
    const docRef = doc(db, DOCUMENT_PATH[0], DOCUMENT_PATH[1]);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as AppData;
          if (remoteData && typeof remoteData === 'object') {
            const cleanRemoteData: AppData = {
              version: remoteData.version || '6.0.0',
              tasks: Array.isArray(remoteData.tasks) ? remoteData.tasks : [],
              courses: Array.isArray(remoteData.courses) ? remoteData.courses : [],
              courseLogs: Array.isArray(remoteData.courseLogs) ? remoteData.courseLogs : [],
            };
            onUpdate(cleanRemoteData);
          }
        } else {
          console.log('⚡ Firebase document does not exist yet. Ready for initial sync.');
          if (onInitialEmpty) onInitialEmpty();
        }
      },
      (err) => {
        console.error('❌ Firestore subscription error (check Security Rules):', err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to Firebase Firestore:', err);
    if (onError) onError(err);
    return () => {};
  }
};

// Smart merge algorithm to prevent data loss between local and remote sources
export const mergeAppData = (local: AppData, remote: AppData): AppData => {
  const taskMap = new Map<string, any>();
  (local.tasks || []).forEach((t) => {
    if (t && t.id) taskMap.set(t.id, t);
  });
  (remote.tasks || []).forEach((t) => {
    if (t && t.id) {
      const existing = taskMap.get(t.id);
      if (!existing) {
        taskMap.set(t.id, t);
      } else {
        taskMap.set(t.id, { ...existing, ...t });
      }
    }
  });

  const courseMap = new Map<string, any>();
  (local.courses || []).forEach((c) => {
    if (c && c.id) courseMap.set(c.id, c);
  });
  (remote.courses || []).forEach((c) => {
    if (c && c.id) {
      const existing = courseMap.get(c.id);
      if (!existing) {
        courseMap.set(c.id, c);
      } else {
        courseMap.set(c.id, { ...existing, ...c });
      }
    }
  });

  const courseLogMap = new Map<string, any>();
  (local.courseLogs || []).forEach((cl) => {
    if (cl && cl.id) courseLogMap.set(cl.id, cl);
  });
  (remote.courseLogs || []).forEach((cl) => {
    if (cl && cl.id) {
      const existing = courseLogMap.get(cl.id);
      if (!existing) {
        courseLogMap.set(cl.id, cl);
      } else {
        courseLogMap.set(cl.id, { ...existing, ...cl });
      }
    }
  });

  return {
    version: remote.version || local.version || '6.0.0',
    tasks: Array.from(taskMap.values()),
    courses: Array.from(courseMap.values()),
    courseLogs: Array.from(courseLogMap.values())
  };
};


