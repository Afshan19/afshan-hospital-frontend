import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Aapki Firebase Config (Yeh bilkul sahi hai)
const firebaseConfig = {
  apiKey: "AIzaSyD66SrPqmBTnAnOoT_NrFIvHTXoe-opTmI",
  authDomain: "afshan-hospital-system.firebaseapp.com",
  projectId: "afshan-hospital-system",
  storageBucket: "afshan-hospital-system.firebasestorage.app",
  messagingSenderId: "258285311801",
  appId: "1:258285311801:web:8cc74f7f8c6fc85362fae8",
  measurementId: "G-NM83Q0GNBV"
};

// Firebase Initialize karein
const app = initializeApp(firebaseConfig);

// Auth aur Firestore export karein
export const auth = getAuth(app);
export const db = getFirestore(app);