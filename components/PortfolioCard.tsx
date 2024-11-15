import { Component,  } from "react"
import {ThemedView} from "@/components/ThemedView";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Props} from "expo-system-ui/plugin/build/withAndroidUserInterfaceStyle";
import {ThemedText} from "@/components/ThemedText";
import V35 from "expo-modules-core/src/uuid/lib/v35";

export default function PortfolioCard({thisPortfolio}:any) {
    console.log("Carregando o portfolio: ",thisPortfolio)
    return(



        <TouchableOpacity style={styles.card} onPress={()=>{}}>
            <View style={styles.fixedInfo} >
                {thisPortfolio&&
                thisPortfolio.title&&
                thisPortfolio.user?
                        (
                            <View>
                            <ThemedText style={styles.text}>Titulo do porfolio</ThemedText>
                            <ThemedText style={styles.infoText}>{thisPortfolio.title}</ThemedText>
                            <ThemedText style={styles.text}>Proprietario do porfolio</ThemedText>
                            <ThemedText style={styles.infoText}>{thisPortfolio.user}</ThemedText>
                            </View>
                        ):(
                        <ThemedText style={styles.text}>carregando... </ThemedText>
                    )
                }
            </View>
            <View style={styles.variableInfo}>
                {thisPortfolio
                &&thisPortfolio.total
                &&thisPortfolio.appreciation?
                    (


                        <View>
                            <ThemedText style={styles.text}>Total do porfolio</ThemedText>
                            <ThemedText style={styles.infoText}>{thisPortfolio.total}R$</ThemedText>
                            <ThemedText style={styles.text}>Valorização do porfolio</ThemedText>
                            <ThemedText style={styles.infoText}>{thisPortfolio.appreciation}%</ThemedText>
                        </View>
                    ):(

                        <ThemedText style={styles.text}>carregando... </ThemedText>
                    )
                }
            </View>
        </TouchableOpacity>
    )

}

 const styles = StyleSheet.create({
    card:{
        height: 150,
        width:'100%',
        padding:10,
        backgroundColor:'#555555',
        justifyContent:'space-evenly',
        flexDirection:'row',
        alignItems:'center',

    },
     text:{
        color:'white',
         fontWeight:'bold',
     },
     fixedInfo:{
         width:'33%',
         height:'90%',
         alignItems:'center',
         justifyContent:'center',
         padding:10
     },
     variableInfo:{
         width:'67%',
         height:'90%',
         padding:10
     },
     infoText:{
        fontSize:32,
         color:'gray'
     }
 })