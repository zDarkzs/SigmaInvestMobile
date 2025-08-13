import { useTheme } from "@/context/ThemeContext";

// Cores que são constantes, independente do tema
const CommonColors = {
  primary: '#1A237E',
  primaryLight: '#534BAE',
  primaryDark: '#000051',

  secondary: '#E53935',
  exit: '#700C0A',

  white: '#FFFFFF',
  black: '#000000',

  success: '#389b3dff',
  warning: '#FFA000',
  error: '#D32F2F',
  danger: '#D32F2F',

  textOnPrimary: '#FFFFFF',
};

// Cores que mudam de acordo com o tema
const ThemedColors = {
  light: {
    background: '#F5F7FA',
    text: '#131313ff',
    textLight: '#5C6BC0',
    cardBackground: '#FFFFFF',
    divider: '#C5CAE9',
  },
  dark: {
    background: '#121744',
    text: '#E8EAF6',
    textLight: '#9FA8DA',
    cardBackground: '#1A237E',
    divider: '#3949AB',
  },
};

// Crie um hook personalizado para fornecer as cores baseadas no tema
export const useAppColors = () => {
  const { theme } = useTheme(); // Agora useTheme é chamado DENTRO de um hook/componente

  return theme === 'dark' ?
    { ...CommonColors, ...ThemedColors.dark } :
    { ...CommonColors, ...ThemedColors.light };
};
