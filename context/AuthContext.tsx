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
    fetchPortfolioAssets: (portfolio:any) => Promise<void>;
    fetchAssets:(assetType:''|'stock'|'crypto'|'currency') => Promise<any>;
    fetchStocks:()=>Promise<any[]>;
}
const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{
    const [token, setToken] = useState<string|null>(null);
    const [apiKey, setApiKey] = useState<string|null>(null);
    const [userData, setUserData] = useState<any|null>(null);
    const [userPortfolios, setUserPortfolios] = useState<any[]|null>(null);
    const [portfolioAssets, setPortfolioAssets] = useState<any[]|null>(null);

    const baseUrl = 'http://localhost:8080'//pode-se alterar pelo ip da maquina

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
                setToken(data.token);
                setApiKey(data.key);
                return;
            }
            console.log(data.error);
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

    const fetchPortfolioAssets:(portfolio:any)=>Promise<void> = async (portfolio:any):Promise<void> =>{
        try{
            const response:Response = await fetch(`${baseUrl}/api/portfolios/${portfolio.id}/assets`,{
                method:'GET',
            });
            const data:any = await response.json();
            console.log('Dados retornados: ',data);
            if(response.ok){
                setPortfolioAssets(data);
            }
        }
        catch (error) {
            console.error("Erro ao buscar ativos da carteira ",error);
        }
    }

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
            return data
        }
        }catch (e) {
            console.error(e)
        }
    }

    const fetchAssets = async (assetType:''|'stock'|'crypto'|'currency'):Promise<any> =>{
     const externalUrl = 'https://brapi.dev/api/';
     const externalEndPoint = {
      stock: 'quote/list',
      crypto: 'v2/crypto/available',//indisponivel
      currency: 'v2/currency/available'//indisponivel
     }
     const responseKeys = {
     stock: 'stocks',
     crypto: 'coins',//indisponivel
     currency: 'currencies',//indisponivel
     }
     try{
           if(assetType == ''){throw new Error("Insira um tipo válido(como você fez isso?)")}

           if(apiKey == null){
               throw new Error("Chave da api não localizada.")
           }
           const params = new URLSearchParams({
               token:apiKey
           })

           const response = await fetch(`${externalUrl + externalEndPoint[assetType]}?${params.toString()}`);
            if(!response.ok){
                throw new Error(response.status + ' ' + response.statusText);
            }
            const data = await response.json();
            const key = responseKeys[assetType];
            return(data[key] || []);
        }
        catch (error:any){
            console.error(error)
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
            fetchAssets,
            fetchStocks,
            fetchUserPortfolios,
            createPortfolio,
            fetchPortfolioAssets}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth:()=> AuthContextType = ():AuthContextType => {

    const context:AuthContextType|undefined = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within the AuthProvider");
    return context;
};