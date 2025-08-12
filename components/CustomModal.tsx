import { Modal, ScrollView, StyleSheet, View, Button, Platform, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { CommonStyles } from "@/constants/ConstantStyles";
import {Colors} from "@/constants/Colors";

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
  style?: any;
}) {
  const modalStyle = (style !== undefined)? (CommonStyles.modalContainer): ([CommonStyles.modalContainer,style])

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      style={styles.overlay}
    >
      <View >
        <View style={modalStyle}>
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

const styles = StyleSheet.create({
  overlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.3)', // ou 'transparent' se não quiser escurecer o fundo
  padding: 16,
},
  modalContentWrapper: {
  minHeight: 100, // ajuste conforme necessário
  justifyContent: 'center',
},

  modalTitleText: {
    fontWeight: "bold",
    fontSize: 30,
    color: Colors.white,
  },
  modalTitleHolder: {
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
