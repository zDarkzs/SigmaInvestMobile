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

  const [newPortfolioTitle, setNewPortfolioTitle] = useState<string>('');

  const closeAllModals = () =>{
    setIsCreateModalVisible(false);
    //Todo: Adicionar o modal de detalhes aqui
  }

  const handleFetchUserPortfolios = async () => {
    if(token){//Um pouco reduntante, mas assegurado
      await fetchUserPortfolios(token);
      return;
    }
    console.error("Token de autenticação não definido!");
  }
  const handleSetPortfolio = () =>{
    setCurrentPortfolio({title:'teste'});
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
                   <PortfolioCard thisPortfolio={portfolio}/>
                 ))}
                   <CreatePortfolioCard onPress={() => {
                       setIsCreateModalVisible(true)
                   }}/>
              <Modal
                  animationType='slide'
                  transparent={true}
                  visible={isCreateModalVisible}
                  onRequestClose={() => setIsCreateModalVisible(false)}
                >


                <View style={styles.modalContent}>
                  <TextInput
                  onChangeText={setNewPortfolioTitle}
                  placeholder='Titulo do portfolio'
                  value={newPortfolioTitle}
                  style={styles.titleInput}
                  />
                  <View style={styles.buttonHolder}>
                    <Button title='Criar Portfolio' onPress={()=>{console.log('escute Jesus is King - Kanye West')}}/>
                    <Button title='Cancelar' color='red' onPress={()=>{setIsCreateModalVisible(false)}}/>
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
    backgroundColor:'red',
    padding:10,
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'flex-start',
  },
    modalContent:{
      margin:'10%',
      backgroundColor:'white',
      width:'90%',
      height:'20%',
      borderRadius:10,
      flexDirection:'column',
      justifyContent:'center',
      alignItems: 'center'
    },
  titleInput:{
    width:'90%',
    height:50,
    fontSize:20
  }

});
