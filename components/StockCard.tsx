import {Component, useContext, useEffect, useState,} from "react"
import {ThemedView} from "@/components/ThemedView";
import {Image, ImageBackground, StyleSheet, TouchableOpacity, View} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";



export default function StockCard({thisStock, onPress, isSelected}:any) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [value, setValue] = useState(0);
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
            flexDirection:'row',
            width:'80%',
            height:100,
            marginTop:-10 ,
            paddingTop:20,
            alignItems:"center",
            backgroundColor:'#555555',
            borderRadius:10,
            zIndex:-1
     },
     cardActionButtonHolder:{

     },
     cardActionButton:{

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