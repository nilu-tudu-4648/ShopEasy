import { initializeApp } from 'firebase/app';
import { getFirestore,doc, getDoc } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDGoejRPaOH1dEn4SIbqG0hAGcZ3QDfCbw",
  authDomain: "desktime-e2f82.firebaseapp.com",
  projectId: "desktime-e2f82",
  storageBucket: "desktime-e2f82.firebasestorage.app",
  messagingSenderId: "919347454139",
  appId: "1:919347454139:web:c55a21bfdabd4520a9099e",
  measurementId: "G-P1GVXV0MLW"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Auth with persistence
export const auth = (() => {
  try {
    return getAuth(app); // Use existing instance if available
  } catch (error) {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
})();

// Helper function to check auth state
export const checkAuthState = async () => {
  try {
    return await new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  } catch (error) {
    console.error('Error checking auth state:', error);
    return null;
  }
};

// Helper function to handle auth errors
export const handleAuthError = (error) => {
  let message = 'An error occurred';
  switch (error.code) {
    case 'auth/invalid-email':
      message = 'Invalid email address';
      break;
    case 'auth/user-disabled':
      message = 'Account has been disabled';
      break;
    case 'auth/user-not-found':
      message = 'User not found';
      break;
    case 'auth/wrong-password':
      message = 'Invalid password';
      break;
    case 'auth/too-many-requests':
      message = 'Too many attempts. Please try again later';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection';
      break;
    default:
      message = error.message;
  }
  return message;
};

// Helper function to ensure user is authenticated
export const ensureAuth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  });
};

// Helper function to get current user data

export const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    return userDoc.exists() ? { ...userDoc.data(), id: user.uid } : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};


// Export Firebase instances and helpers
export default {
  app,
  db,
  auth,
  checkAuthState,
  handleAuthError,
  ensureAuth,
  getCurrentUserData
};