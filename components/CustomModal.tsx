import { Modal, ScrollView, StyleSheet, View, Button, Platform } from "react-native";
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
    >
      <View style={styles.overlay}>
        <View style={modalStyle}>
          {title && (
            <View style={styles.modalTitleHolder}>
              <ThemedText style={styles.modalTitleText}>{title}</ThemedText>
            </View>
          )}
          {children}
          <Button title="Fechar" color="red" onPress={onClose} />
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
  modalTitleText: {
    fontWeight: "bold",
    fontSize: 30,
    color: Colors.white,
  },
  modalTitleHolder: {
    width: "100%",
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
