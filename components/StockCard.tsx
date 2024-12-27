import {Component, useContext, useEffect, useState,} from "react"
import {ThemedView} from "@/components/ThemedView";
import {Button, Image, ImageBackground, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";

import {useAuth} from '@/context/AuthContext';

export default function StockCard({thisStock, onPress, currentPortfolio, isSelected}:any) {

    const {
        token,
        fetchPortfolioAssets
    } = useAuth();

    const handleVenda = ()=>{
        try {

        }catch (erro){
            console.log(erro)
        }
    }
    const handleCompra = () =>{
        try {

        }catch (erro){
            console.log(erro)
        }
    }

    const [isExpanded, setIsExpanded] = useState(false);
    const [quantity, setQuantity] = useState("0");
    const [quotation, setQuotation] = useState(thisStock.close||"0.0");
    const [time, setTime] = useState(0);
    const handleCardPress = ()=>{

        setIsExpanded(prev => !prev);
        if (onPress){onPress()}
    }

    return(
    <View style={styles.card}>
    <TouchableOpacity style={styles.cardContent} onPress={handleCardPress}>

            <View style={styles.basicInfo}>
                {thisStock&&
                thisStock.stock&&
                thisStock.logo?(
                    <>
                        <Image source={{uri: thisStock.logo}} style={styles.logoImg}/>

                        <ThemedText style={styles.infoText}>{thisStock.stock}</ThemedText>
                    </>
                ):(
                    <ThemedText >Informações da ação  não carregadas</ThemedText>
                )}

            </View>
            <View style={styles.variableInfo}>
                {thisStock&&
                thisStock.name&&
                thisStock.close?(
                    <>
                        <ThemedText>Empresa</ThemedText>
                        <ThemedText style={styles.infoText}>{thisStock.name}$</ThemedText>
                        <ThemedText>Ultimo fechamento</ThemedText>
                        <ThemedText style={styles.infoText}>R${thisStock.close}</ThemedText>
                    </>
                ):(
                    <ThemedText>Informações da ação não carregadas</ThemedText>
                )}

            </View>

                </TouchableOpacity>
                {isExpanded&&(
                        <View style={styles.cardActions}>
                            <ThemedText style={styles.infoText}> Movimentar cotas  </ThemedText>
                            <View>
                                <ThemedText>Quantidade de cotas</ThemedText>
                                  <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    placeholder="Digite a quantidade"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                  />

                              {/* Campo para valor de cada cota */}
                              <ThemedText>Valor por cota (R$)</ThemedText>
                              <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="Digite o valor"
                                value={quotation}
                                onChangeText={setQuotation}
                              />
                            </View>
                            <View style={styles.cardActionButtonHolder}>
                                <Button title='Vender' color='red'/>
                                <Button title='Comprar' color='green'/>
                            </View>
                        </View>
                        )}
    </View>

)}

 const styles = StyleSheet.create({
     card:{
       flexDirection:'column',
         width: '100%',
         alignItems:'center',
         justifyContent:'center',

     },
    cardContent:{
        height: 150,
        width:'100%',
        borderRadius:10,
        flexDirection:'row',
        backgroundColor:'#555555',
        alignItems:'center',

        justifyContent:'space-evenly',


    },
        cardActions:{
            flexDirection:'column',
            width:'80%',
            marginTop:-10 ,
            paddingVertical:10,
            alignItems:"center",
            backgroundColor:'#555555',
            borderRadius:10,
            zIndex:-1
     },
     cardActionButtonHolder:{
         flexDirection:'row',
         gap:5,
     },
     cardActionButton:{

     },
     input:{
       color:'white',
        backgroundColor:'#444444',
         borderRadius:5,
         padding:3
     },
     basicInfo:{
        flexDirection:'column',
         alignItems:'flex-start',
         justifyContent:'center',
         paddingVertical:'2%',
         paddingHorizontal:'2%',
         width:'20%',
         height:'90%',
         borderRadius:10,

         backgroundColor:'#333333'
     },
     variableInfo:{
        flexDirection:'column',
         alignItems:'flex-start',
         paddingVertical:'2%',
         paddingHorizontal:'2%',
         justifyContent:'center',
         width:'75%',
         height:'90%',
         borderRadius:10,

         backgroundColor:'#444444',
     },
     infoText:{
        fontWeight:'bold',
         fontSize:24,

     },
      logoImg:{
        width:'100%',
        height:'100%',
    },

 })