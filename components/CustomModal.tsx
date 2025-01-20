import {Button, Modal, ScrollView, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";

export default function CustomModal({ visible, onClose, children, title }: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
    return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.modalContent} >
        <Button title="Fechar" color="red" onPress={onClose} />
        {title && (
          <View style={styles.modalTitleHolder}>
            <ThemedText style={styles.modalTitleText}>{title}</ThemedText>
          </View>
        )}
        {children}
      </ScrollView>
    </Modal>
  );
};const styles = StyleSheet.create({
   modalTitleText: {
    fontWeight:"bold",
    fontSize:30,
    flexDirection: 'row',
  },
    modalTitleHolder:{
      width:'100%',
      backgroundColor:'#555555',
      alignItems:'center',
      padding:10,
      borderColor:'white',
      borderTopLeftRadius:6,
      borderTopRightRadius:6,
    },
    modalContent:{
      margin:'10%',
      backgroundColor:'#444444',
      borderRadius:10,
      padding:5,
      flexDirection:'column',
      justifyContent:'space-evenly',
      alignItems: 'center',
      boxShadow:'10px 5px 5px black',
      gap:10,
    },
});