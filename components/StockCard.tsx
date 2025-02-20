import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, TextInput, Button } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import CustomModal from "@/components/CustomModal";
import {toBRL} from "@/scripts/utils";

export default function StockCard({ thisStock, onPress, onFinishTransaction, portfolio, isSelected }: any) {
  const { transaction } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("0");
  const [quotation, setQuotation] = useState(thisStock?.close || "0.0");
  const[isInPortfolio,setIsInPortfolio] = useState((thisStock.quantity&&thisStock.average_price));
  console.log(isInPortfolio);
  // Função para lidar com a compra
  const handleTransaction = async (quantity:string,quotation:string) => {
    //Como cada card tem o portfolio e o ativo já definido então para esta função se passa só as informações variaveis
    try {
      console.log("Tentativa de compra para o portfólio:", portfolio.id);
      console.log("Quantidade:", quantity, "Valor por cota:", quotation);
      if(!(thisStock&&thisStock.stock)){
        throw new Error('Erro ao enviar informações do ativo')
      }
      if(!(portfolio&&portfolio.id)){
        throw new Error('Erro ao enviar informações da carteira')
      }
      const history  = await transaction(thisStock.stock,portfolio.id,quantity,quotation);
    } catch (erro) {
      console.error("Erro ao processar compra:", erro);
    }
    setIsExpanded(false);
    setIsCompleteModalVisible(false);
    setQuotation(thisStock?.close || "0.0");
    setQuantity("0")
  };

  // Função para lidar com a venda
  const handleVenda = () => {
    try {
      console.log("Venda efetuada para o portfólio:", portfolio);
      console.log("Quantidade:", quantity, "Valor por cota:", quotation);
    } catch (erro) {
      console.error("Erro ao processar venda:", erro);
    }
  };

  // Função para alternar a expansão do card
  const handleCardPress = () => {
    setIsExpanded((prev) => !prev);
    if (onPress) onPress();
  };
  const testTransaction = ()=>{

  };
  const finishTransaction=()=>{

  }
  return (
    <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent} onPress={handleCardPress}>
          <View style={styles.basicInfo}>
            {thisStock?.stock && thisStock?.logo ? (
              <>
                <Image source={{ uri: thisStock.logo }} style={styles.logoImg} />
                <ThemedText style={styles.infoText}>{thisStock.stock}</ThemedText>
              </>
            ) : (
              <ThemedText>Informações da ação não carregadas</ThemedText>
            )}
          </View>
          <View style={styles.variableInfo}>
            {thisStock?.name && thisStock?.close && (
              <View style={styles.stockInfo}>
                <ThemedText>Empresa</ThemedText>
                <ThemedText style={styles.infoText}>{thisStock.name}</ThemedText>
                <ThemedText>Último fechamento</ThemedText>
                <ThemedText style={styles.infoText}>{toBRL(thisStock.close)}</ThemedText>
              </View>

            )}
            {thisStock?.quantity && thisStock?.average_price && (
                <View style={styles.stockInfo}>
                <ThemedText>Na carteira</ThemedText>
                <ThemedText style={styles.infoText}>{parseInt(thisStock.quantity)} cotas</ThemedText>
                <ThemedText>Preço médio de compra</ThemedText>
                <ThemedText style={styles.infoText}>{toBRL(thisStock.average_price)}</ThemedText>
              </View>
            )}
          </View>
        </TouchableOpacity>

      {isExpanded && (
        <View style={styles.cardActions}>
          <ThemedText style={styles.infoText}>Movimentar cotas</ThemedText>
          <View>
            <ThemedText>Quantidade de cotas</ThemedText>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Digite a quantidade"
              value={quantity}
              onChangeText={setQuantity}
            />
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
            <Button title="Vender" color="red" onPress={async()=>{
              await handleTransaction(('-'+quantity),quotation);
            }} />
            <Button title="Comprar" color="green" onPress={async () => {
              await handleTransaction(quantity,quotation);
            }} />
            <Button title="Teste" color="yellow" onPress={testTransaction}/>
          </View>
        </View>
      )}

      <CustomModal visible={isCompleteModalVisible} onClose={finishTransaction}>
        <ThemedText>Transação feita com sucesso!✔</ThemedText>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    gap:10,
    width: "90%",
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#555555",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  cardActions: {
    flexDirection: "column",
    width: "80%",
    marginTop: -20,
    zIndex:-1,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: "#555555",
    borderRadius: 10,
  },
  cardActionButtonHolder: {
    flexDirection: "row",
    gap: 5,
  },
  input: {
    color: "white",
    backgroundColor: "#444444",
    borderRadius: 5,
    padding: 3,
  },
  basicInfo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2%",
    width: undefined,
    height: "90%",
    aspectRatio:1,
    borderRadius: 10,
    backgroundColor: "#333333",
  },
  variableInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "2%",
    width: "75%",
    height: "90%",
    borderRadius: 10,
    backgroundColor: "#444444",
  },
  stockInfo:{},
  propertyInfo:{},
  infoText: {
    fontWeight: "bold",
    fontSize: 24,
    resizeMode:'contain'
  },
  logoImg: {
    width: undefined,
    height: "100%",
    aspectRatio:1
  },
});
