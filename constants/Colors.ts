import {useColorScheme} from "react-native";

const CommonColors = {
  primary: '#1A237E',
  primaryLight: '#534BAE',
  primaryDark: '#000051',

  secondary: '#E53935',
  exit: '#700C0A',

  white: '#FFFFFF',
  black: '#000000',

  success: '#388E3C',
  warning: '#FFA000',
  error: '#D32F2F',
  danger: '#D32F2F',

  textOnPrimary: '#FFFFFF',
};

const ThemedColors ={
  light: {
    background: '#F5F5F5',
    text: '#333333',
    textLight: '#666666',
    cardBackground: '#FFFFFF',
    divider: '#DDDDDD',
  },
  dark: {
    background: '#323232',
    text: '#EEEEEE',
    textLight: '#BBBBBB',
    cardBackground: '#1E1E1E',
    divider: '#333333',
  },
}
export const Colors = useColorScheme() ==='dark'?
  (
    {...CommonColors,...ThemedColors.dark}
  ):(
    {...CommonColors,...ThemedColors.light}
  );
