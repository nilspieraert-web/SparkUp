import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  Auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { Firestore, serverTimestamp, doc, setDoc, initializeFirestore, getFirestore } from 'firebase/firestore';
import type { UserProfile } from '../types/auth';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const readEnv = (expoKey: string, legacyKey: string) =>
  process.env[expoKey] ?? process.env[legacyKey] ?? '';

const firebaseConfig = {
  apiKey: readEnv('EXPO_PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY'),
  authDomain: readEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER'),
  appId: readEnv('EXPO_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_APP_ID'),
};

const isPlaceholderValue = (value?: string) => {
  if (!value) {
    return true;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return normalized.includes('your') || normalized.includes('jouw') || normalized.includes('replace');
};

export const isFirebaseConfigured = !(
  isPlaceholderValue(firebaseConfig.apiKey) ||
  isPlaceholderValue(firebaseConfig.authDomain) ||
  isPlaceholderValue(firebaseConfig.projectId) ||
  isPlaceholderValue(firebaseConfig.storageBucket) ||
  isPlaceholderValue(firebaseConfig.messagingSenderId) ||
  isPlaceholderValue(firebaseConfig.appId)
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const ensureFirebase = () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Populate the EXPO_PUBLIC_FIREBASE_* variables to enable cloud sync.');
  }
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  const firebaseApp = app!;
  if (!auth) {
    if (Platform.OS === 'web') {
      auth = getAuth(firebaseApp);
    } else {
      try {
        auth = initializeAuth(firebaseApp, {
          persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
      } catch {
        // If auth is already initialized (fast refresh), fall back to the default getter.
        auth = getAuth(firebaseApp);
      }
    }
  }
  if (!db) {
    // In React Native environments WebChannel can be blocked; opt into long polling automatically.
    try {
      db = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
      });
    } catch {
      // Fast refresh may already have an instance; fall back to the cached singleton.
      db = getFirestore(firebaseApp);
    }
  }
  return { app: app!, auth: auth!, db: db! };
};

export const getFirebaseAuth = () => (auth ?? ensureFirebase().auth);
export const getFirestoreDb = () => (db ?? ensureFirebase().db);

// ---------- Auth API ----------
export const firebaseAuthApi = {
  signIn: async (email: string, password: string) => {
    const a = getFirebaseAuth();
    const { user } = await signInWithEmailAndPassword(a, email, password);
    return user;
  },
  signUp: async (displayName: string, email: string, password: string) => {
    const a = getFirebaseAuth();
    const { user } = await createUserWithEmailAndPassword(a, email, password);
    if (displayName) await updateProfile(user, { displayName });
    return user;
  },
  sendPasswordReset: async (email: string) => {
    const a = getFirebaseAuth();
    await sendPasswordResetEmail(a, email);
  },
  signOut: async () => {
    const a = getFirebaseAuth();
    await signOut(a);
  },
};

// ---------- Firestore helpers ----------
export const createUserProfileDocument = async (uid: string, data: UserProfile) => {
  const d = getFirestoreDb();
  const ref = doc(d, 'users', uid);
  await setDoc(
    ref,
    {
      displayName: data.displayName,
      email: data.email,
      role: data.role,
      avatarUrl: data.avatarUrl ?? null,
      createdAt: data.createdAt ?? serverTimestamp(),
    },
    { merge: true },
  );
};

export const firebaseTimestamps = { serverTimestamp };
