import { StyleSheet, ViewStyle, TextStyle } from 'react-native'; // Importe os tipos de estilo
import { useAppColors } from '@/constants/Colors'; // Importe o hook de cores que você já criou

// Defina uma interface para o TIPO DE RETORNO do hook,
// que representa as propriedades do objeto de estilos criado por StyleSheet.create.
// Removemos 'borderRadius: number' daqui pois não é uma propriedade de estilo raiz.
interface CommonStylesType {
  container: ViewStyle; // Use tipos de estilo específicos
  overContainer: ViewStyle;
  loadingContainer: ViewStyle;
  headerText: TextStyle; // Use TextStyle para texto
  sectionTitle: TextStyle;
  input: TextStyle | ViewStyle; // Pode ser ViewStyle se for só o container do input
  button: ViewStyle;
  buttonText: TextStyle;
  warningText: TextStyle;
  card: ViewStyle;
  modalContainer: ViewStyle;
  // Se 'borderRadius: 10' for uma constante comum, ela deve ser definida fora de StyleSheet.create
  // ou aplicada diretamente às propriedades de borderRadius nos estilos individuais.
}

// Crie e exporte um hook personalizado
export const useCommonStyles = () => {
  // Obtenha as cores do tema atual através do seu hook de cores
  const Colors = useAppColors();

  // Defina os estilos usando as cores obtidas
  // O tipo inferido por StyleSheet.create já é NamedStyles<...>
  // Atribuir a 'styles' diretamente para 'CommonStylesType' pode ser feito,
  // mas é mais comum deixar o TypeScript inferir se a interface é apenas para documentação.
  // Se quiser forçar o tipo, o tipo de `styles` seria `StyleSheet.NamedStyles<CommonStylesType>`
  const styles = StyleSheet.create<CommonStylesType>({ // Explicitamente tipa o objeto passado para create
    container: {
      flex: 1,
      // padding: 20, // Removido para ser consistente com o seu Configs.tsx
      backgroundColor: Colors.background,
    },
    overContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'space-around'
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    headerText: {
      fontSize: 48,
      fontWeight: 'bold' as const,
      color: Colors.text, // Reativo ao tema
      borderBottomWidth: 1,
      marginTop: 20,
      borderBottomColor: Colors.textLight // Reativo ao tema
    },
    sectionTitle: {
      fontSize: 20,
      color: Colors.primary, // Reativo ao tema
      borderBottomColor: Colors.primary, // Reativo ao tema
      margin: 20,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: Colors.divider, // Reativo ao tema
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      backgroundColor: Colors.white, // Se o input for sempre branco, ok. Se não, use Colors.cardBackground ou Colors.background
      color: Colors.text, // Adicionado para garantir que o texto do input seja legível
    },
    button: {
      backgroundColor: Colors.primary, // Reativo ao tema
      borderRadius: 8,
      padding: 15,
      alignItems: 'center' as const,
      marginVertical: 10,
    },
    buttonText: {
      color: Colors.textOnPrimary, // Esta cor geralmente é contrastante com Colors.primary, se for fixa, ok
      fontWeight: 'bold' as const,
      fontSize: 16,
      margin: 7,
    },
    warningText: {
      color: Colors.warning, // Esta cor é CommonColors, ok
      fontWeight: 'bold' as const,
      fontSize: 22,
    },
    card: {
      backgroundColor: Colors.cardBackground, // Reativo ao tema
      borderRadius: 10, // Adicionado aqui, se for para o card
      padding: 15,
      marginBottom: 15,
      shadowColor: Colors.textLight, // Reativo ao tema
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    modalContainer: {
      maxWidth: '80%',
      margin: '10%',
      backgroundColor: Colors.cardBackground, // Reativo ao tema
      borderRadius: 10, // Adicionado aqui, se for para o modal container
      padding: 9,
      alignItems: 'center' as const,
      justifyContent: 'flex-start' as const,
      gap: 15,
      elevation: 5,
      shadowColor: Colors.black, // Se shadow for sempre preto, ok. Se não, use uma cor reativa.
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    // Removido: borderRadius: 10, // Esta linha estava causando o erro
  });

  return styles;
};
