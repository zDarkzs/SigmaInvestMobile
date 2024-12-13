import {Component, useContext,} from "react"
import {ThemedView} from "@/components/ThemedView";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";



export default function StockCard({thisStock, onPress}:any) {

    return(

        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.constInfo}>
                {thisStock&&
                thisStock.stock&&
                thisStock.logo?(
                    <>
                        <Image source={{uri: thisStock.logo}}/>
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
    )

}

 const styles = StyleSheet.create({
    card:{
        height: 150,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        justifyContent:'space-evenly',

    },
     constInfo:{
        flexDirection:'column',
         alignItems:'flex-start',
         justifyContent:'center',
         paddingVertical:'2%',
         paddingHorizontal:'2%',
         width:'34%',
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
         width:'60%',
         height:'90%',
         borderRadius:10,

         backgroundColor:'#444444',
     },
     infoText:{
        fontWeight:'bold',
         fontSize:24,

     },
     posApprecText:{
         fontWeight:'bold',
         fontSize:24,
         color:'green',
     },
     negApprecText:{
         fontWeight:'bold',
         fontSize:24,
         color:'red',
     },
 })