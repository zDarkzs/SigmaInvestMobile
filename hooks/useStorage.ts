import { db } from '@/services/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário registrado:", user.uid);
  } catch (error) {
    console.error("Erro no registro:", error);
  }
};
const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário logado:", user.uid);
  } catch (error) {
    console.error("Erro no login:", error);
  }
};