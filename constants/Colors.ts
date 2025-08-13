import {useColorScheme} from "react-native";

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

export const Colors = useColorScheme() ==='dark'?
  (
    {...CommonColors,...ThemedColors.dark}
  ):(
    {...CommonColors,...ThemedColors.light}
  );
