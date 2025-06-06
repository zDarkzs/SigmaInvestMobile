import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhy1WOwZxaFCuRe4jIHtbS_9RyjqxxbYM",
  authDomain: "coinfin-c265a.firebaseapp.com",
  projectId: "coinfin-c265a",
  storageBucket: "coinfin-c265a.appspot.com",
  messagingSenderId: "853363855278",
  appId: "1:853363855278:web:cd7d5f91c3335d3a88823f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services
export { db, auth, storage };