import {Button, Modal, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";

export default function CustomModal({ visible, onClose, children, title }: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
    return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContent}>
        {title && (
          <View style={styles.modalTitleHolder}>
            <ThemedText style={styles.modalTitleText}>{title}</ThemedText>
          </View>
        )}
        {children}
        <Button title="Fechar" color="red" onPress={onClose} />
      </View>
    </Modal>
  );
};const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  buttonHolder:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems: 'flex-start',
  },

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
      paddingBottom:5,
      flexDirection:'column',
      justifyContent:'space-evenly',
      alignItems: 'center',
      boxShadow:'10px 5px 5px black',
      gap:10,
    },

  titleInput:{
    width:'95%',
    height:50,
    fontSize:20,
    backgroundColor:'#777777',
    borderColor:'white',
    borderRadius:5,
    padding:10,
    borderStyle:'solid',
    color:'white'
  },
  infoTable:{
    alignItems: "flex-start",
    justifyContent:'flex-start',
    flexDirection:"column",
    gap:5,
  },
  portfolioInfoDescription:{
    fontWeight:'bold',
    fontSize:25,
  },
  portfolioInfoContent:{
    fontSize:25,
  },
  infoRowContainer:{
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
  },
  card:{
    height: 150,
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    backgroundColor:'#C6BD48',
    borderRadius:15,
  },
  cardText:{
    fontSize:30,
    color:'white',
    fontWeight:'bold',
  },
  noAssetsContainer: {
  alignItems: 'center',
  marginVertical: 20,
},
noAssetsText: {
  fontSize: 30,
  color: '#999',
},
assetRow: {
  flexDirection: 'row',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
},
assetText: {
  fontSize: 16,
  color: '#333',
},
typeSelector: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 20,
  gap:5
},
typeButton: {
  padding: 10,
  borderRadius: 10,
  backgroundColor: '#777777',
  alignItems:'center',
},
selectedTypeButton: {
  backgroundColor: '#C6BD48',
},
typeButtonText: {
  color: 'white',
  fontSize: 30,
  fontWeight: 'bold',
},
input: {
  width: '95%',
  height: 50,
  fontSize: 18,
  backgroundColor: '#777777',
  color: 'white',
  borderRadius: 5,
  padding: 10,
  marginVertical: 10,
},

});