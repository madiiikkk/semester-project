import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDwPNgdSUkEdID1Rg6AYQ3oDoxCj9lqp7I",
  authDomain: "expoapp-5d297.firebaseapp.com",
  projectId: "expoapp-5d297",
  storageBucket: "expoapp-5d297.firebasestorage.app",
  messagingSenderId: "140512605397",
  appId: "1:140512605397:web:b19cf33ffa8ebc5d27de5c",
  measurementId: "G-MM5E2LMNL5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);  // Initialize auth

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };
