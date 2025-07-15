import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Switch,
  Button,
  ScrollView,
  Alert, Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { CommonStyles } from "@/constants/ConstantStyles";
import {useStocks} from "@/context/StockContext";
import CustomModal from "@/components/CustomModal";
import Banner from "@/components/Banner";



export default function SettingsScreen() {
  const {
    isAuthenticated,
    login,
    register,
    userData,
    logout
  } = useAuth();
  const {
    resetStockData,
    resetLocalData,
    exportStockSharesToJSON,
    exportStockSharesToCSV,
    importJSONData
  } = useStocks();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [hasAccount, setHasAccount] = useState(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] =  useState<string|null>(null);

  const handleAuthError = ()=>{
    setErrorMessage("Houve um erro ao fazer sua autenticação, tente novamente.");
  }

  //Só para o usuário saber que houve uma nova solicitação.
  useEffect(() => {
    if (isLoading) setErrorMessage(null)
  }, [isLoading]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
    }catch (e) {
      handleAuthError()
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await register(username, email, password);
      if (userData?.uid) {
        await setDoc(doc(db, "users", userData.uid), {
          username,
          email,
          preferences: { darkMode, notifications },
          profile: {
            bio: "",
            user_since: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      handleAuthError();
      Alert.alert("Erro", "Falha ao registrar: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () =>{
    setIsLoading(true);
    try {
      await resetLocalData()
    }catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleImport = async () =>{
    try{
      importJSONData()
    }catch (e) {
      console.error(e);
    }
  }

  return (
    <ScrollView style={CommonStyles.container}>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Carregando...</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={CommonStyles.container}>
          {isAuthenticated ? (
            <>
              <View style={styles.profileHeader}>
                <Ionicons
                  name="person-circle"
                  size={80}
                  color={Colors.primary}
                />
                <ThemedText type="title" style={styles.username}>
                  {userData?.username}
                </ThemedText>
                <ThemedText style={styles.email}>{userData?.email}</ThemedText>
              </View>

              <View style={styles.section}>
                <ThemedText type="subtitle" style={styles.preferenceItemText}>
                  Preferências
                </ThemedText>

                <View style={styles.preferenceItem}>
                  <ThemedText style={styles.preferenceItemText}>
                    Modo Escuro
                  </ThemedText>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    thumbColor={Colors.primary}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>

                <View style={styles.preferenceItem}>
                  <ThemedText style={styles.preferenceItemText}>
                    Notificações
                  </ThemedText>
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    thumbColor={Colors.primary}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.authSection}>
              <ThemedText type="title" style={styles.authTitle}>
                Acesse sua conta
              </ThemedText>

              {!hasAccount && (
                <TextInput
                  style={CommonStyles.input}
                  placeholder="Nome de usuário"
                  value={username}
                  onChangeText={setUsername}
                />
              )}
              <TextInput
                style={CommonStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={CommonStyles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <View style={styles.authButtons}>
                {hasAccount ? (
                  <>
                    <TouchableOpacity
                      style={CommonStyles.button}
                      onPress={handleLogin}
                    >
                      <ThemedText style={CommonStyles.buttonText}>
                        Entrar
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        CommonStyles.button,
                        { backgroundColor: Colors.success },
                      ]}
                      onPress={() => setHasAccount(false)}
                    >
                      <ThemedText style={CommonStyles.buttonText}>
                        Criar conta...
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={CommonStyles.button}
                      onPress={handleRegister}
                    >
                      <ThemedText style={CommonStyles.buttonText}>
                        Registrar
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        CommonStyles.button,
                        { backgroundColor: Colors.warning },
                      ]}
                      onPress={() => setHasAccount(true)}
                    >
                      <ThemedText style={CommonStyles.buttonText}>
                        Entrar em conta existente...
                      </ThemedText>
                    </TouchableOpacity>
                  </>
                )}
              {errorMessage &&
                  <View style={{width:'100%',height:30}}>

              <Banner visible={true}>
                 <ThemedText style={CommonStyles.warningText}>{errorMessage}</ThemedText>
                </Banner>
                  </View>
              }
              </View>

            </View>
          )}

          <View style={styles.utilButtonGroup}>
            <Button title={'Transferir dados..'} color={'green'} onPress={()=>setIsExportDialogOpen(true)}/>
            <Button title={'Apagar dados locais'} color={'red'} onPress={handleReset}/>
            <Button title={'Apagar dados na nuvem'} color={'red'} onPress={resetStockData}/>
            {isAuthenticated &&
            <Button title="Sair" onPress={logout} color={Colors.secondary} />
            }
          </View>
        </ThemedView>

      )}

      <CustomModal visible={isExportDialogOpen} title={"Transferir Dados"} onClose={()=>setIsExportDialogOpen(false)}>
        <TouchableOpacity style={[styles.exportButtons,{backgroundColor:'blue'}]} onPress={exportStockSharesToJSON}>
          <Text style={[CommonStyles.buttonText,{fontSize: 32}]}>{" Para JSON { }"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportButtons,{backgroundColor:'green'}]} onPress={exportStockSharesToCSV}>
          <Text style={[CommonStyles.buttonText,{fontSize: 32}]}>{" Para Excel  .CSV"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportButtons,{backgroundColor:'orange'}]} onPress={()=>{setIsImportModalOpen(true)}}>
          <Text style={[CommonStyles.buttonText,{fontSize: 32}]}>{" Importar dados JSON { }"}</Text>
        </TouchableOpacity>
      </CustomModal>

      <CustomModal title={"Importar dados"} visible={isImportModalOpen} onClose={()=>{setIsImportModalOpen(false)}}>
        <Button title={"abrir arquivo"} onPress={handleImport}/>
      </CustomModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  utilButtonGroup:{
    flexDirection: 'row',
    flexWrap:'wrap',
    gap:15,
    justifyContent: "center",
  },
  username: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 24,
  },
  email: {
    color: Colors.black,
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 15,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  preferenceItemText: {
    color: Colors.primary,
  },
  authSection: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 20,
  },
  authTitle: {
    textAlign: "center",
    marginBottom: 20,
    color: Colors.primary,
  },
  authButtons: {
    marginTop: 10,
  },
  text: {
    fontWeight: "bold",
    color: Colors.textOnPrimary,
  },
  exportButtons:{
    width:'80%',
    borderRadius:10,
    alignItems:'center'
  }
});
