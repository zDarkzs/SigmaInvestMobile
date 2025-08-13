import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { AuthProvider } from "@/context/AuthContext";
import {ThemeProvider, useTheme} from "@/context/ThemeContext"; // Importe useTheme também
import { StockProvider } from "@/context/StockContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Este componente interno espera pelas fontes e pelo tema
function RootLayoutContent() {
  const { isThemeLoading } = useTheme(); // Obtenha o estado de carregamento do tema

  useEffect(() => {
    // Só esconde a splash screen quando as fontes E o tema estiverem carregados
    if (!isThemeLoading) {
      SplashScreen.hideAsync();
    }
  }, [isThemeLoading]);

  // Enquanto as fontes ou o tema estiverem carregando, mostre um indicador
  if (isThemeLoading) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color="#1A237E" /> {/* Cor primária padrão */}
        <Text style={loadingStyles.text}>Carregando...</Text>
      </View>
    );
  }

  // Se tudo carregou, renderize o Stack principal do seu app
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// O componente principal que provê todos os contextos
export default function RootLayout() {
  return (
    <AuthProvider>
      <StockProvider>
        <ThemeProvider>
          <RootLayoutContent /> {/* Renderize o conteúdo que espera pelo tema */}
        </ThemeProvider>
      </StockProvider>
    </AuthProvider>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA', // Um fundo claro padrão enquanto carrega
  },
  text: {
    marginTop: 10,
    color: '#131313ff', // Um texto escuro padrão
  },
});
