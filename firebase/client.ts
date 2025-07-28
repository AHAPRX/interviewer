// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZLtjs0RAFL2B8wz4UAEXOAZn8KwBTHkU",
  authDomain: "intpre.firebaseapp.com",
  projectId: "intpre",
  storageBucket: "intpre.firebasestorage.app",
  messagingSenderId: "295722815531",
  appId: "1:295722815531:web:fa3d84cacf30407ae11a6e",
  measurementId: "G-7E20DW0HBT",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
