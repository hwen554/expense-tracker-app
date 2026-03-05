// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2yAi-VBc_tJmKiCD6TTmzM-LviY1SZ-E",
  authDomain: "expense-tracker-11354.firebaseapp.com",
  projectId: "expense-tracker-11354",
  storageBucket: "expense-tracker-11354.firebasestorage.app",
  messagingSenderId: "124468829104",
  appId: "1:124468829104:web:368dacb2f6636439cc9475",
  measurementId: "G-6GEERTEB6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
})

// db
export const firebaseDb = getFirestore(app);

//firestore
export const firestore = getFirestore(app);