import {Component, useContext,} from "react"
import {ThemedView} from "@/components/ThemedView";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";

export default function CreatePortfolioCard() {
    return(


        <TouchableOpacity style={styles.card} onPress={()=>{}}>
            <ThemedText style={styles.cardText}>Adicionar Portfolio</ThemedText>
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
        backgroundColor:'#C6BD48',
        borderRadius:15,

    },
     cardText:{
        fontSize:30,
         color:'white',
         fontWeight:'bold',
     }
 })