import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Replace the values below with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDYCId6a0xOqbDi13rko_bSvIRv0KNmcNI",
  authDomain: "fir-9-26d77.firebaseapp.com",
  projectId: "fir-9-26d77",
  storageBucket: "fir-9-26d77.firebasestorage.app",
  messagingSenderId: "995514548945",
  appId: "1:995514548945:web:a43c7592b043b164f17bf0",
  measurementId: "G-BPNQ5G1XH0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const dbRt = getDatabase(app);