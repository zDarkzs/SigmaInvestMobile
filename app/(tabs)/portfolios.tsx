import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, Image, Platform, Button, View, Modal, TouchableOpacity, TextInput} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
//import {PortfolioCard}
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useAuth} from "@/context/AuthContext";
import React, {useState} from "react";
import PortfolioCard from "@/components/PortfolioCard";
import CreatePortfolioCard from "@/components/CreatePortfolioCard";

export default function PortfoliosScreen() {
  const { token,userPortfolios, fetchUserPortfolios} = useAuth();
  const [currentPortfolio, setCurrentPortfolio] = useState<any|null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const [newPortfolioTitle, setNewPortfolioTitle] = useState<string>('');

  const closeAllModals = () =>{ //Evita bugs de mais de um modal ficar aberto
    setIsCreateModalVisible(false);
    setIsDetailModalVisible(false);
    setCurrentPortfolio(null);
  }

  const handleFetchUserPortfolios = async () => {
    if(token){//Um pouco reduntante, mas assegurado
      await fetchUserPortfolios(token);
      return;
    }
    console.error("Token de autenticação não definido!");
  }
  const handleSetPortfolio = ({portfolio}:any|null) =>{
    if(portfolio){
      setCurrentPortfolio(portfolio);
      setIsDetailModalVisible(true);
      return;
    }
  }




  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="briefcase" style={styles.headerImage} />}>
        <ThemedText type="title"> Seus Portfolios</ThemedText>
          {userPortfolios?(
            <ThemedView>
              <ThemedView style={styles.buttonHolder}>
              <Button title='Recarregar porfolios'  onPress={handleFetchUserPortfolios}/>
              <Button title='Definir portfolio(debug)'  onPress={handleSetPortfolio}/>
              </ThemedView>


                {userPortfolios?.map((portfolio,index)=>(
                   <PortfolioCard thisPortfolio={portfolio} onPress={handleSetPortfolio} />
                 ))}
                   <CreatePortfolioCard onPress={() => {
                       setIsCreateModalVisible(true)
                   }}/>
              {/*Modal para criar portfolios*/}
              <Modal
                  animationType='slide'
                  transparent={true}
                  visible={isCreateModalVisible}
                  onRequestClose={() => closeAllModals()}
                >
                <View style={styles.modalContent}>
                  <TextInput
                  onChangeText={setNewPortfolioTitle}
                  placeholder='Titulo do portfolio'
                  value={newPortfolioTitle}
                  style={styles.titleInput}
                  />
                  <View style={styles.buttonHolder}>
                    <Button title='Criar Portfolio'  onPress={()=>{closeAllModals()}}/>
                    <Button title='Cancelar' color='red' onPress={()=>{closeAllModals()}}/>
                  </View>
                </View>
              </Modal>

              {/* Modal de detalhes do portfolio */}
              <Modal
                  animationType='slide'
                  transparent={true}
                  visible={isDetailModalVisible}
                  onRequestClose={() => closeAllModals()}
                >
                <View style={styles.modalContent}>
                  <TextInput
                  onChangeText={setNewPortfolioTitle}
                  placeholder='Titulo do portfolio'
                  value={newPortfolioTitle}
                  style={styles.titleInput}
                  />
                  <View style={styles.buttonHolder}>
                    <Button title='Criar Portfolio'  onPress={()=>{closeAllModals()}}/>
                    <Button title='Cancelar' color='red' onPress={()=>{closeAllModals()}}/>
                  </View>
                </View>
              </Modal>

              </ThemedView>
               ):(
            <ThemedText type="subtitle"> Faça login ou cadastre-se para ver seus portfolios</ThemedText>
          )}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonHolder:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems: 'flex-start',
  },

    modalContent:{
      margin:'10%',
      backgroundColor:'#444444',
      width:'90%',
      height:'20%',
      borderRadius:10,
      flexDirection:'column',
      justifyContent:'space-evenly',
      alignItems: 'center',
      boxShadow:'10px 5px 5px black',
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
  }

});
