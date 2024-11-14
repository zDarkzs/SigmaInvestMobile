import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, Image, Platform, Button, View} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
//import {PortfolioCard}
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useAuth} from "@/context/AuthContext";
import {useState} from "react";
import PortfolioCard from "@/components/PortfolioCard";

export default function PortfoliosScreen() {
  const { token,userPortfolios, fetchUserPortfolios} = useAuth();
  const [currentPortfolio, setCurrentPortfolio] = useState<any|null>(null);
  const handleFetchUserPortfolios = async () => {
    if(token){//Um pouco reduntante, mas assegurado
      await fetchUserPortfolios(token);
    }
    console.error("Token de autenticação não definido!");
  }
  const handleSetPortfolio = () =>{
    setCurrentPortfolio({title:'teste'});
  }
  if(currentPortfolio){
    return (
        <ThemedView>
          <ThemedText>
            {currentPortfolio.title}
          </ThemedText>
        </ThemedView>
    )

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
              <Button title='Definir portfolio(debug)' onPress={handleSetPortfolio}/>
              </ThemedView>

              <ThemedText type="subtitle"> Seus Portfolios</ThemedText>
                {userPortfolios?.map((portfolio,index)=>(
                   <PortfolioCard thisPortfolio={portfolio}/>
                 ))}
              </ThemedView>
               ):(
            <ThemedText type="subtitle"> Faça login ou cadastre-se para ver seus portfolios</ThemedText>
          )}
      <View style={styles.screenConsumer}></View>

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
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonHolder:{
    height:150,
    width:'33%',
    marginVertical:'2%',
    flexDirection:'column',
    justifyContent:'space-evenly',
    alignItems: 'flex-start',
  },
  screenConsumer:{
    height:'100%',
  }
});
