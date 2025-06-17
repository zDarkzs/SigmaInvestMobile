import React, {createContext, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiConfig } from "@/types/dividendTypes";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/services/firebaseConfig";
import { UserData } from "@/types/userTypes";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<UserData>;
  logout: () => Promise<void>;
  userData: UserData | null;
  stocks: string[] | null;
  apiConfig: ApiConfig | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [stocks, setStocks] = useState<string[] | null>(null);
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);
  const [userData, setUserData] = useState<{
    uid: string;
    email: string;
    username: string;
  } | null>(null);
  const baseUrl = "http://192.168.55.24:8080/"; //pode-se alterar pelo ip da maquina
  useEffect(() => {
  const loadFromStorage = async () => {
    try {
      const json = await AsyncStorage.getItem("@userData");
      if (json) {
        const storedUser: UserData = JSON.parse(json);
        setUserData(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Erro ao carregar do AsyncStorage:", error);
    }
  };

  loadFromStorage();
}, []);
  const setSession = async () => {
   if (userData) {
      try {
        const json = JSON.stringify(userData);
        await AsyncStorage.setItem("@userData", json);
      } catch (e) {
        console.error("Erro ao salvar sessão", e);
      }
    }
};

useEffect(() => {
  if (userData) {
    setSession();
  }
}, [userData]);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Tenta buscar username do AsyncStorage (se tiver sido salvo no register)
      const username = await AsyncStorage.getItem("user_username");

      setUserData({
        uid: user.uid,
        email: user.email ?? "",
        username: username ?? "", // fallback caso não tenha username
      });

      setIsAuthenticated(true);
      console.log("Usuário logado:", user.uid);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem("@userData");
    setIsAuthenticated(false);
    setUserData(null);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await AsyncStorage.setItem("user_uid", user.uid);
      await AsyncStorage.setItem("user_email", user.email ?? "");
      await AsyncStorage.setItem("user_username", username);

      const userInfo = {
        uid: user.uid,
        email: user.email ?? "",
        username,
      };

      setUserData(userInfo);
      setIsAuthenticated(true);
      console.log("Usuário registrado:", user.uid);

      return userInfo; // <--- Retorne os dados do usuário
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        stocks,
        logout,
        userData,
        apiConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth: () => AuthContextType = (): AuthContextType => {
  const context: AuthContextType | undefined = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within the AuthProvider");
  return context;
};
