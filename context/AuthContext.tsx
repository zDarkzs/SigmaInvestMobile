import React, {createContext, useContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {string} from "prop-types";


interface AuthContextType {
    token: string|null;
    apiKey: string|null;
    userData: any|null;
    isAuthenticated: boolean;
    userPortfolios: any[] |null;
    portfolioAssets: any[] |null;
    login: (username:string, password:string) => Promise<void>;
    register:(username:string,password:string,email:string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUserPortfolios: (token:string) => Promise<void>;
    createPortfolio: (token:string, title:string) => Promise<'OK'|'ERROR'|undefined>;
    fetchStocks:()=>Promise<any[]>;
    transaction:(asset:any,portfolioId:string,quantity:string,quotation:string) => Promise<any>;
}
const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{
    const [token, setToken] = useState<string|null>(null);
    const [apiKey, setApiKey] = useState<string|null>(null);
    const [userData, setUserData] = useState<any|null>(null);
    const [userPortfolios, setUserPortfolios] = useState<any[]|null>(null);
    const [portfolioAssets, setPortfolioAssets] = useState<any[]|null>(null);

    const baseUrl = 'http://192.168.55.24:8080/'//pode-se alterar pelo ip da maquina

    const fetchUserData:(token:string)=>Promise<void> = async (token:string):Promise<void> =>{
      try{
          const response:Response = await fetch(`${baseUrl}/auth/getdata/`,{
            method:'POST',
              headers:{
                'Authorization': `Token ${token}`,
                'Content-Type':'application/json',

              },
          });
        if(response.ok){
            const userData:any = await response.json();
            console.log(userData);
            setUserData(userData);
            await fetchUserPortfolios(token);
        }
      }catch (error) {
          console.error("Erro ao buscar dados de usuario ",error);
      }
    };

    const login:(username:string,password:string)=>Promise<void> = async (username:string,password:string) => {
        try {
            const response:Response = await fetch(`${baseUrl}/auth/login/`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            const data:any = await response.json();
            console.log(data);
            if (response.ok){
                await AsyncStorage.setItem('token', data.token);
                await fetchUserData(data.token);
                await AsyncStorage.setItem('key', data.key);
                setToken(data.token);
                setApiKey(data.key);
            } else {
                console.log(data.error);
            }
        }catch (error){
            console.error("Erro ao fazer login: ",error);
        }
    };

    const register:(username:string,email:string,password:string)=>Promise<void> = async (username: string, email: string, password:string ):Promise<void> =>{
        try {
            const response:Response = await fetch(`${baseUrl}/auth/signup/`,{
                method: 'POST',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password, email}),
            });

            const data:any = await response.json();
            if (response.ok){
                await AsyncStorage.setItem('token', data.token);
                await fetchUserData(data.token);
                await AsyncStorage.setItem('key', data.key);
                setToken(data.token);
                setApiKey(data.key);
                return;
            }
            console.error(data.error);
            return;


        }catch (error){
            console.error("Erro ao registrar: ",error);
        }
    }

    const logout:()=>Promise<void> = async ():Promise<void> => {
        await AsyncStorage.removeItem('token');
        setToken(null);
    };

    const fetchUserPortfolios:(token:string) => Promise<void> = async (token:string):Promise<void> =>{
        try {
            console.log(`Token utilizado:`,token);
            const response:Response = await fetch(`${baseUrl}/api/portfolios/byuser/`,{
                method:'GET',
                headers:{
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data:any = await response.json();
            console.log(`Dados retornados: `,data);
            if(response.ok){
                setUserPortfolios(data);
            }
        }catch (error){
            console.error("Erro ao buscar carteiras de usuario ",error);
        }
    };

    const createPortfolio:(token:string,title:string)=>Promise<'OK'|'ERROR'|undefined> = async (token:string, title:string):Promise<'OK'|'ERROR'|undefined> =>{
        try{
            const response:Response = await fetch(`${baseUrl}/api/portfolios/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title}),
            });
            const data:any = await response.json();
            console.log(`Dados retornados: `, data)
            if (response.ok) {
                console.log('Carteira criada com sucesso', data);
                await fetchUserPortfolios(token);
                return 'OK';
            }
        }catch (erro){
            console.error(`Erro ao criar o portfolio: ${erro}`)
            return 'ERROR';
        }
    }


    const fetchStocks = async () =>{
        try{

        const response = await fetch(`${baseUrl}/api/assets/stocks`,{
            method : 'POST',

            headers:{
                'Authorization': `Token ${token}`,
                'Content-Type': 'application-json',
            }
        })
        const data = await response.json();
        if (response.ok){
            console.log(data);
            return data
        }
        }catch (e) {
            console.error(e)
        }
    }

    const transaction = async (asset:string,portfolioId:string,quantity:string,quotation:string)=>{
        try {
            const response = await fetch(`${baseUrl}/api/portfolios/${portfolioId}/history/`,{
                method:'POST',
                headers:{
                    'Authorization': `Token ${token}`,
                    'Content-type': 'application/json',
                },
                body:JSON.stringify({asset,portfolioId,quantity,quotation})
            })
            const data = await response.json()
            if (response.ok){
                return data;
            }
        }catch (e) {
            console.error(e)
        }
    }
     return (
        <AuthContext.Provider value={{ token,
            isAuthenticated: !!token,
            apiKey,
            login,
            register,
            logout,
            userData,
            userPortfolios,
            portfolioAssets,
            fetchStocks,
            fetchUserPortfolios,
            createPortfolio,
            transaction}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth:()=> AuthContextType = ():AuthContextType => {

    const context:AuthContextType|undefined = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within the AuthProvider");
    return context;
};