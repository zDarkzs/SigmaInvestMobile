import { Modal, ScrollView, StyleSheet, View, Button, Platform, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useCommonStyles } from "@/hooks/useCommonStyles"; // Importar o hook de estilos comuns
import {useAppColors} from "@/constants/Colors"; // Importar o hook de cores
import { StyleProp, ViewStyle } from 'react-native'; // Importar tipos para estilos

export default function CustomModal({
  visible,
  onClose,
  children,
  title,
  style
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>; // Tipagem correta para o prop 'style'
}) {
  // Chame o hook de cores e estilos comuns dentro do componente
  const Colors = useAppColors();
  const commonStyles = useCommonStyles(); // Obtenha os estilos comuns reativos

  // Lógica corrigida para combinar estilos
  // Se 'style' for fornecido, combine-o com 'commonStyles.modalContainer'.
  // Caso contrário, use apenas 'commonStyles.modalContainer'.
  const modalStyle = style ? [commonStyles.modalContainer, style] : commonStyles.modalContainer;

  // Defina os estilos específicos do modal DENTRO do componente, após chamar os hooks
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)', // Cor de fundo do overlay
      padding: 16, // Adicionado padding para criar margem visual no modal
    },
    modalContentWrapper: {
      minHeight: 100,
      justifyContent: 'center',
      paddingBottom: 50,
      width: '100%', // Adicionado para garantir que o conteúdo preencha a largura do modal
    },
    modalTitleText: {
      fontWeight: "bold",
      fontSize: 30,
      color: Colors.textOnPrimary, // Usar Colors.textOnPrimary para garantir contraste com Colors.primary
    },
    modalTitleHolder: {
      width: "100%",
      backgroundColor: Colors.primary, // Cor primária do tema
      alignItems: "center",
      padding: 10,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay} >
        <View style={modalStyle}> {/* Aplica o estilo combinado aqui */}
          {title && (
            <View style={styles.modalTitleHolder}>
              <ThemedText style={styles.modalTitleText}>{title}</ThemedText>
            </View>
          )}
          <View style={styles.modalContentWrapper}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}
