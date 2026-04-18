// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAikjJ48_5ZylIqwU9wqBYITlN8tBwv-cA",
  authDomain: "civic-fix-ai.firebaseapp.com",
  projectId: "civic-fix-ai",
  storageBucket: "civic-fix-ai.firebasestorage.app",
  messagingSenderId: "193739900000",
  appId: "1:193739900000:web:69f516c600ff0fbbc92f05",
  measurementId: "G-3H3D0EC910"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);