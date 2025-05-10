import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// COPY THIS EXACTLY FROM YOUR FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyAlTLR0XqnQy_xiyc_8QTln8XGNcVdjLgI",
  authDomain: "foodgallery-ae35a.firebaseapp.com",
  projectId: "foodgallery-ae35a",
  storageBucket: "foodgallery-ae35a.firebasestorage.app",
  messagingSenderId: "529341306747",
  appId: "1:529341306747:web:a0a0fd0366ef6ed152cfde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);