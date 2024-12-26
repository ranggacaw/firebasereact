// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAk3UIl2_FTiqllV96hzFb5793aDD54EHM",
  authDomain: "reactproject-61d80.firebaseapp.com",
  projectId: "reactproject-61d80",
  storageBucket: "reactproject-61d80.firebasestorage.app",
  messagingSenderId: "294661853367",
  appId: "1:294661853367:web:647aac6dc4dc71501d7d32",
  measurementId: "G-46KHJBBT1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }

