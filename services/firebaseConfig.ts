// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhy1WOwZxaFCuRe4jIHtbS_9RyjqxxbYM",
  authDomain: "coinfin-c265a.firebaseapp.com",
  projectId: "coinfin-c265a",
  storageBucket: "coinfin-c265a.appspot.com",
  messagingSenderId: "853363855278",
  appId: "1:853363855278:web:cd7d5f91c3335d3a88823f",
};

// Garante que o app e auth só sejam inicializados uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth para React Native com persistência em AsyncStorage
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Auth já foi inicializado, então podemos apenas usar getAuth
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
