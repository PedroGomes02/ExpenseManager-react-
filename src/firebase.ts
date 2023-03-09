import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsfa1ygwUrRxktuHp-F0Jbe-7712l6Em8",
  authDomain: "angularexpensemanager.firebaseapp.com",
  projectId: "angularexpensemanager",
  storageBucket: "angularexpensemanager.appspot.com",
  messagingSenderId: "354149813167",
  appId: "1:354149813167:web:67aa0845a6c87174b17d5a",
  measurementId: "G-YXPV80BTFY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
