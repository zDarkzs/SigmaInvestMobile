import Ionicons from '@expo/vector-icons/Ionicons';
import React, {useState} from "react";
import {StyleSheet, Button, View, Modal, TouchableOpacity, TextInput, ScrollView} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import {useAuth} from "@/context/AuthContext";

import PortfolioCard from "@/components/PortfolioCard";
import StockCard from "@/components/StockCard";
import CustomModal from "@/components/CustomModal";

export default function PortfoliosScreen() {

  const {
    token,
    userPortfolios,
    fetchUserPortfolios,
    fetchStocks,
    fetchStockDetails,
    createPortfolio,
    fetchPortfolioAssets,
    portfolioAssets,
    updateAssetsInfo
    } = useAuth();




  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState<string>('');
  const [isCreationOKModalVisible, setIsCreationOKModalVisible] = useState(false);
  const [isCreationERRORModalVisible, setIsCreationERRORModalVisible] = useState(false);
  const [areStocksUpdated, setAreStocksUpdated] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isStockListModalVisible, setIsStockListModalVisible] = useState(false);

  const [selectedType,setSelectedType] = useState<''|'stock'|'crypto'|'currency'>('');
  type OrderByType =
  '' |
  'name' |
  'close' |
  'change' |
  'change_abs' |
  'volume' |
  'market_cap_basic' |
  'sector';
  const [orderBy, setOrderBy] = useState<OrderByType>('');

  const [currentPortfolio, setCurrentPortfolio] = useState<any|null>(null);
  const [currentPortfolioAssets, setCurrentPortfolioAssets] = useState<any[]|null>(null);
  const [currentSearchAssets, setCurrentSearchAssets] = useState<any[]|null>(null);
  const[currentStock,setCurrentStock] = useState<any|null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [assets, setAssets] = useState<any[]|null>(null);
  const handleCreateNewPortfolio:()=>Promise<void> = async ():Promise<void> => {
    if(token&&newPortfolioTitle){
      const tryCreation = await createPortfolio(token,newPortfolioTitle);
      if(tryCreation === 'OK'){
        console.log('Porfolio criado com sucesso');
        setIsCreationOKModalVisible(true);
        setNewPortfolioTitle('');
      }
      if(tryCreation === 'ERROR'){
        console.log('Erro ao criar o portfolio');
        setIsCreationERRORModalVisible(true);
      }
    }
  }

  const handleStockSearch = async () =>{
      try{
        if (selectedType != 'stock'){
          throw new Error('Selecione um tipo válido(cryptos e moedas estão indisponiveis)')
        }
        const stocks = await fetchStocks()
        setCurrentSearchAssets(stocks);
        //setIsStockListModalVisible(true);
        console.log(currentSearchAssets);
      }
    catch (error){
        console.error(error);
        //TODO: criar um modal de erro
    }
  }

  const handleStockSelect = async (stock:any) =>{
    console.log(stock)
    return
  }

  const handleTransactionComplete = async ()=>{
    setCurrentSearchAssets([]);
  }

  const closeAllModals = () =>{ //Evita bugs de mais de um modal ficar aberto
    setIsCreateModalVisible(false);
    setIsCreationOKModalVisible(false);
    setIsCreationERRORModalVisible(false);
    setIsDetailModalVisible(false);
    setIsTransactionModalVisible(false);
    setIsStockListModalVisible(false);
    setCurrentPortfolio(null);
  }

  const handleFetchUserPortfolios = async () => {
    if(token){//Um pouco reduntante, mas assegurado
      await fetchUserPortfolios(token);
      return;
    }
    console.error("Token de autenticação não definido!");
  }

  const handlePortfolioCardPress = async (portfolio:any) =>{

    setCurrentPortfolio(portfolio);

    await updateAssetsInfo();
    setAreStocksUpdated(true)
    console.log(portfolioAssets);
    setIsDetailModalVisible(true);

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
              </ThemedView>


                {userPortfolios?.map((portfolio,index)=>(
                   <PortfolioCard thisPortfolio={portfolio} onPress={() =>{handlePortfolioCardPress(portfolio);}} />
                 ))}

              <TouchableOpacity style={styles.card} onPress={() => setIsCreateModalVisible(true)}>
                <ThemedText style={styles.cardText}>Adicionar Portfolio</ThemedText>
              </TouchableOpacity>

              {/*Modal para criar portfolios*/}
              <CustomModal visible={isCreateModalVisible} onClose={closeAllModals}>
                  <View style={styles.modalTitleHolder}>
                    <ThemedText style={styles.modalTitleText}>Criar novo portfolio</ThemedText>
                  </View>

                  <TextInput
                  onChangeText={setNewPortfolioTitle}
                  placeholder='Titulo do portfolio'
                  value={newPortfolioTitle}
                  style={styles.titleInput}
                  />
                  <View style={styles.buttonHolder}>
                    <Button title='Criar Portfolio'  onPress={handleCreateNewPortfolio}/>
                  </View>
              </CustomModal>

              {/* Modal de criacao bem sucedida */}
              <CustomModal
                  visible={isCreationOKModalVisible}
                  onClose={closeAllModals}
              >
                <View style={styles.modalTitleHolder}>
                  <ThemedText style={styles.modalTitleText}>Portfolio Criado com sucesso! ✔</ThemedText>
                  </View>
                  <Button title='Fechar' onPress={closeAllModals}/>
              </CustomModal>

              {/* Modal de criacao com erro */}
              <CustomModal visible={isCreationERRORModalVisible} onClose={closeAllModals}>
                <ThemedText style={styles.modalTitleText}>Houve um erro ao criar o portfolio ❌</ThemedText>
                  <Button title='Fechar' onPress={closeAllModals}/>
              </CustomModal>

              {/* Modal de detalhes do portfolio */}
              <CustomModal visible={isDetailModalVisible} onClose={closeAllModals}>
                 {currentPortfolio&&
                  currentPortfolio.title?(
                    <View style={styles.modalTitleHolder}>
                    <ThemedText style={styles.modalTitleText}>Detalhes do portfolio</ThemedText>
                    </View>
                ):(
                    <ThemedText style={styles.modalTitleText}>Portfolio não carregado</ThemedText>
                )}
                  {
                    currentPortfolio&&
                      currentPortfolio.title&&
                      currentPortfolio.total&&
                      currentPortfolio.appreciation?(
                          <>
                            <View style={styles.infoTable}>
                              <View style={styles.infoRowContainer}>
                                <ThemedText style={styles.portfolioInfoDescription}>Título:</ThemedText>
                                <ThemedText style={styles.portfolioInfoContent}>{currentPortfolio.title}</ThemedText>
                              </View>
                              <View style={styles.infoRowContainer}>
                                <ThemedText style={styles.portfolioInfoDescription}>Total:</ThemedText>
                                <ThemedText style={styles.portfolioInfoContent}>{currentPortfolio.total}</ThemedText>
                              </View>
                              <View style={styles.infoRowContainer}>
                                <ThemedText style={styles.portfolioInfoDescription}>Valorização:</ThemedText>
                                <ThemedText style={styles.portfolioInfoContent}>{currentPortfolio.appreciation}</ThemedText>
                              </View>
                            </View>
                          </>
                    ):('')
                  }

                  {
                   currentPortfolio && portfolioAssets && currentPortfolio.assets.length > 0 ? (
                    currentPortfolio&&portfolioAssets.map((stock:any, index:number) => (
                     <StockCard thisStock={stock} portfolio={currentPortfolio} onPress={()=>{handleStockSelect(stock)}} />
                    ))
                  ) : (
                    <View style={styles.noAssetsContainer}>
                     <ThemedText style={styles.noAssetsText}>
                      Nenhum ativo encontrado para este portfólio.
                     </ThemedText>
                   </View>
                   )
                  }
                    <View style={styles.buttonHolder}>
                      <Button title='Adicionar ativo' onPress={()=>{setIsTransactionModalVisible(true)}} />
                    </View>

              </CustomModal>


              {/* Modal de transação financeira */}
              <CustomModal visible={isTransactionModalVisible} onClose={()=> {
                setIsTransactionModalVisible(false);
                handleFetchUserPortfolios();
              }}>
                 <View style={styles.modalTitleHolder}>
                  <ThemedText style={styles.modalTitleText}>Adicionar ativo</ThemedText>
                  </View>

                  {/* Seleção de tipo */}
                  <View style={styles.typeSelector}>
                    <TouchableOpacity
                    style={[
                        styles.typeButton,
                        selectedType == 'stock' && styles.selectedTypeButton
                    ]}
                    onPress={()=>{setSelectedType('stock')}}
                    >
                      <ThemedText>📊</ThemedText>
                      <ThemedText style={styles.typeButtonText}>Ações</ThemedText>
                    </TouchableOpacity>

                    {/* OPÇÃO CRIPTO // DESCONTINUADA
                    <TouchableOpacity
                    style={[
                    styles.typeButton,
                    selectedType === 'crypto' && styles.selectedTypeButton,
                    ]}
                    onPress={() => setSelectedType('crypto')}
                   >

                    <ThemedText style={styles.typeButtonText}>🔒</ThemedText>
                    <ThemedText style={styles.typeButtonText}>Cripto</ThemedText>
                  </TouchableOpacity>
                    */}
                    {/* OPÇÃO MOEDA // DESCONTINUADA
                  <TouchableOpacity
                    style={[
                    styles.typeButton,
                    selectedType === 'currency' && styles.selectedTypeButton,
                    ]}
                    onPress={() => setSelectedType('currency')}
                    >
                    <ThemedText style={styles.typeButtonText}>💰</ThemedText>
                    <ThemedText style={styles.typeButtonText}>Moeda</ThemedText>
                  </TouchableOpacity>
                    */}
                  </View>
                  <View style={styles.modalTitleHolder}>
                    <ThemedText style={styles.modalTitleText}>Ordenar por</ThemedText>
                  </View>
                  <View>

                  </View>
                {currentPortfolio&&currentSearchAssets?.map((stock,index)=>(
                    <StockCard thisStock={stock} portfolio={currentPortfolio} onPress={()=>{handleStockSelect(stock)}} />
                  ))}
                  <View style={styles.buttonHolder}>
                    {selectedType === '' ? (''):(
                      <Button title='PESQUISAR' onPress={()=>{handleStockSearch()}}/>
                    )}
                </View>
              </CustomModal>

              <CustomModal visible={isStockListModalVisible} onClose={()=> {setIsStockListModalVisible(false)}}>
                <ScrollView>
                    <View style={styles.buttonHolder}>
                      <Button title='Fechar' color='red' onPress={()=>{setIsStockListModalVisible(false)}}/>
                    </View>
                    {currentSearchAssets?.map((stock,index)=>(
                    <StockCard thisStock={stock} onPress={()=>{handleStockSelect(stock)}} />
                  ))}
                </ScrollView>
              </CustomModal>

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
  color: '#ffffff',
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
