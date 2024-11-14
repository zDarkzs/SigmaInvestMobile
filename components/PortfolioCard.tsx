import { Component, } from "react"
import {ThemedView} from "@/components/ThemedView";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";

export default function PortfolioCard({thisPortfolio}:any) {
    return(



        <TouchableOpacity style={styles.card} onPress={()=>{}}>
            <ThemedText>{
                thisPortfolio&&
                thisPortfolio.title?
                (thisPortfolio.title):("titulo do portfolio não carregado")}</ThemedText>
        </TouchableOpacity>
    )

}

 const styles = StyleSheet.create({
    card:{
        height: 150,
        width:'100%',
        backgroundColor:'red',


    }
 })