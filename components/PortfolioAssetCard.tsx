
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";



export default function PortfolioAssetCard({thisAsset, onPress}:any) {

    return(

        <TouchableOpacity style={styles.card} onPress={onPress}>

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