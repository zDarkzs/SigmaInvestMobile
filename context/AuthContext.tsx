import React, {createContext, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {string} from "prop-types";
import {ApiConfig} from "@/types/dividendTypes";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/services/firebaseConfig";


interface AuthContextType {
    isAuthenticated: boolean;
    login: (username:string, password:string) => Promise<void>;
    register:(username:string,password:string,email:string) => Promise<void>;

    stocks:string[] |null;
    apiConfig:ApiConfig|null;
}
const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [stocks, setStocks] = useState<string[]|null>(null);
    const [apiConfig, setApiConfig] = useState<ApiConfig|null>(null);

    const baseUrl = 'http://192.168.55.24:8080/'//pode-se alterar pelo ip da maquina

   const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário logado:", user.uid);
    setIsAuthenticated(true)
  } catch (error) {
    console.error("Erro no login:", error);
  }
};

    const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário registrado:", user.uid);
  } catch (error) {
    console.error("Erro no registro:", error);
  }
};


     return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            register,
            stocks,
            apiConfig}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth:()=> AuthContextType = ():AuthContextType => {

    const context:AuthContextType|undefined = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within the AuthProvider");
    return context;
};