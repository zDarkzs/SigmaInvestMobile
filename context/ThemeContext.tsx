import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  // Adiciona a prop para permitir acessar o estado de carregamento do tema
  isThemeLoading: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Chave para armazenar o tema no AsyncStorage
const THEME_STORAGE_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Define o estado inicial como 'light' ou null para indicar que ainda não carregou
  const [theme, setTheme] = useState<ThemeType>('light');
  // Novo estado para indicar se o tema está sendo carregado do AsyncStorage
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Efeito para carregar o tema do AsyncStorage ao montar o componente
  useEffect(() => {
    const loadTheme = async () => {
      try {
        setIsThemeLoading(true); // Começa a carregar
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        } else {
          // Se não houver tema salvo, define um padrão (ex: 'light')
          setTheme('light');
        }
      } catch (error) {
        console.error("Erro ao carregar tema do AsyncStorage:", error);
        // Em caso de erro, ainda define um padrão
        setTheme('light');
      } finally {
        setIsThemeLoading(false); // Termina de carregar
      }
    };

    loadTheme();
  }, []); // Executa apenas uma vez ao montar o componente

  // Efeito para salvar o tema no AsyncStorage sempre que o estado 'theme' mudar
  useEffect(() => {
    // Só salva se o tema já foi carregado inicialmente
    if (!isThemeLoading) {
      const saveTheme = async () => {
        try {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
          console.error("Erro ao salvar tema no AsyncStorage:", error);
        }
      };
      saveTheme();
    }
  }, [theme, isThemeLoading]); // Depende de 'theme' e 'isThemeLoading'

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Se o tema ainda está carregando, você pode renderizar um componente de carregamento
  // Ou simplesmente retornar null para não renderizar nada até que o tema seja carregado.
  if (isThemeLoading) {
    return null; // Ou um <LoadingScreen />
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isThemeLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
