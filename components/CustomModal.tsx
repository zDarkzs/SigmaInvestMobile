import { Modal, ScrollView, StyleSheet, View, Button, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { CommonStyles } from "@/constants/ConstantStyles";

export default function CustomModal({
  visible,
  onClose,
  children,
  title,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Button title="Fechar" color="red" onPress={onClose} />
          {title && (
            <View style={styles.modalTitleHolder}>
              <ThemedText style={styles.modalTitleText}>{title}</ThemedText>
            </View>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    ...CommonStyles.modalTopRight,
    width:'50%'// <- AQUI usa o novo estilo de canto superior direito
  },
  modalTitleText: {
    fontWeight: "bold",
    fontSize: 30,
  },
  modalTitleHolder: {
    width: "100%",
    backgroundColor: "#555555",
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
