// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxDKXNt11uLffZCUIrk6ABnKTJZMieN-U",
  authDomain: "cos201.firebaseapp.com",
  projectId: "cos201",
  storageBucket: "cos201.firebasestorage.app",
  messagingSenderId: "698839712799",
  appId: "1:698839712799:web:60d18dcfa747bab439412a",
  measurementId: "G-0Y9CCPY2GG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);