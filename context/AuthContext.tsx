import React, {createContext, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";



interface AuthContextType {
    token: string|null;
    userData: any|null;
    isAuthenticated: boolean;
    userPortfolios: any[] |null;
    login: (username:string, password:string) => Promise<void>;
    register:(username:string,password:string,email:string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUserPortfolios: (token:string) => Promise<void>;
}
const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{
    const [token, setToken] = useState<string|null>(null);
    const [userData, setUserData] = useState<any|null>(null);
    const [userPortfolios, setUserPortfolios] = useState<any[]|null>(null);

    const baseUrl = 'localhost:8080'//pode-se alterar pelo ip da maquina

    const fetchUserData = async (token:string) =>{
      try{
          const response = await fetch(`${baseUrl}/auth/getdata/`,{
            method:'POST',
              headers:{
                'Authorization': `Token ${token}`,
                'Content-Type':'application/json',

              },
          });
        if(response.ok){
            const userData = await response.json();
            setUserData(userData);
            await fetchUserPortfolios(token);
        }
      }catch (error) {
          console.error("Erro ao buscar dados de usuario ",error);
      }
    };

    const login = async (username:string,password:string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login/`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            console.log(response);
            const data = await response.json();
            if (response.ok){
                await AsyncStorage.setItem('token', data.token);
                await fetchUserData(data.token);
                setToken(data.token);
            } else {
                console.log(data.error);
            }
        }catch (error){
            console.error("Erro ao fazer login: ",error);
        }
    };

    const register = async (username: string, email: string, password:string ) =>{
        try {
            const response = await fetch(`${baseUrl}/auth/signup/`,{
                method: 'POST',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password, email}),
            });

            const data = await response.json();
            if (response.ok){
                await AsyncStorage.setItem('token', data.token);
                await fetchUserData(data.token);
                setToken(data.token);
                return;
            }
            console.log(data.error);
            return;


        }catch (error){
            console.error("Erro ao registrar: ",error);
        }
    }

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
    };

    const fetchUserPortfolios = async (token:string) =>{
        try {
            console.log(`Token utilizado:`,token);
            const response = await fetch(`${baseUrl}/api/portfolios/byuser/`,{
                method:'GET',
                headers:{
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log(`Dados retornados: `,data);
            if(response.ok){
                setUserPortfolios(data);
            }
        }catch (error){
            console.error("Erro ao buscar carteiras de usuario ",error);
        }
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token,login,register,logout,fetchUserPortfolios,userData,userPortfolios}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {

    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within the AuthProvider");
    return context;
};