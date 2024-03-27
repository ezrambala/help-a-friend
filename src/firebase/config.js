// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDisFGMIRLvATrRripwKE8wQKdNU_oXrU0",
  authDomain: "help-a-friend-ezra.firebaseapp.com",
  projectId: "help-a-friend-ezra",
  storageBucket: "help-a-friend-ezra.appspot.com",
  messagingSenderId: "154959348840",
  appId: "1:154959348840:web:853d45991595ff5fe7a7dd",
  measurementId: "G-JZ2J3ZL8LL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
