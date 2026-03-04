// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgYaWimpoK_TWC0tnMC3rqWT0KQr3uFxk",
  authDomain: "nas-pg.firebaseapp.com",
  projectId: "nas-pg",
  storageBucket: "nas-pg.firebasestorage.app",
  messagingSenderId: "505674510976",
  appId: "1:505674510976:web:d848ec3b720ba1136bac65",
  measurementId: "G-619XYWENTV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app); // Firestore Database
export const auth = getAuth(app); // Authentication
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
