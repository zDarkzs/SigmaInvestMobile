import {Component, useContext,} from "react"
import {ThemedView} from "@/components/ThemedView";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";

export default function PortfolioCard({thisPortfolio, appreciation,onPress}:any) {



    return(

        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.constInfo}>
                {thisPortfolio&&
                thisPortfolio.title&&
                thisPortfolio.user?(
                    <>
                    <ThemedText>Titulo da carteira</ThemedText>
                    <ThemedText style={styles.infoText}>{thisPortfolio.title}</ThemedText>
                        <ThemedText>Proprietario</ThemedText>
                    <ThemedText style={styles.infoText}>{thisPortfolio.username}</ThemedText>
                    </>
                ):(
                    <ThemedText >Informações da carteira  não carregadas</ThemedText>
                )}

            </View>
           <View style={styles.variableInfo}>
                 {thisPortfolio&&
                thisPortfolio.total&&
                thisPortfolio.appreciation?(
                    <>
                    <ThemedText>Total da carteira</ThemedText>
                    <ThemedText style={styles.infoText}>{thisPortfolio.total}$</ThemedText>
                        <ThemedText>Valorização</ThemedText>
                    <ThemedText style={appreciation>=0?(styles.posApprecText):(styles.negApprecText)}>{appreciation.toFixed(2)}%</ThemedText>
                    </>
                ):(
                    <ThemedText>Informações da carteira  não carregadas</ThemedText>
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