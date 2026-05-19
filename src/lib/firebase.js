import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// These values should be replaced with actual Firebase configuration
// from the Firebase Console (Environment variables are recommended for production)
const firebaseConfig = {
  apiKey: "AIxxxxxx",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""             //ADD your firebase details
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
