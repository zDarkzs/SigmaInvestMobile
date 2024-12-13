import {Component, useContext, useEffect, useState,} from "react"
import {ThemedView} from "@/components/ThemedView";
import {Image, ImageBackground, StyleSheet, TouchableOpacity, View} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";



export default function StockCard({thisStock, onPress}:any) {
    const [logoUrl, setLogoUrl] = useState<string>('');


    return(

        <TouchableOpacity style={styles.card} onPress={onPress}>
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
    )

}

 const styles = StyleSheet.create({
    card:{
        height: 150,
        width:'100%',
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        justifyContent:'space-evenly',

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
    }
 })