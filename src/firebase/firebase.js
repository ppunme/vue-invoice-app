import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtKaBU7gdWpEnhF74CEVC-CQXUBmMObls",
  authDomain: "vue-invoice-app-6c4d8.firebaseapp.com",
  projectId: "vue-invoice-app-6c4d8",
  storageBucket: "vue-invoice-app-6c4d8.appspot.com",
  messagingSenderId: "1004370428032",
  appId: "1:1004370428032:web:306f39e3c6e3a7ef506665",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
