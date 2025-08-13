import React, {useEffect, useState} from "react";
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Switch,
    Button,
    ScrollView,
    Alert, Text, Pressable, Image
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useAuth} from "@/context/AuthContext";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/services/firebaseConfig";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {useAppColors} from "@/constants/Colors"; // Importe o hook de cores
import {useCommonStyles} from "@/hooks/useCommonStyles";
import {useStocks} from "@/context/StockContext";
import CustomModal from "@/components/CustomModal";
import Banner from "@/components/Banner";
import {StockShares} from "@/types/dividendTypes";
import AdBanner from "@/components/AdBanner";
import {useTheme} from "@/context/ThemeContext";

export default function SettingsScreen() {
    const {
        isAuthenticated,
        login,
        register,
        userData,
        logout
    } = useAuth();
    const {
        stockShares,
        resetStockData,
        updateStockAmount,
        resetLocalData,
        exportStockSharesToJSON,
        exportStockSharesToCSV,
        importJSONData,
        compareImportedWithCurrent,

    } = useStocks();
    const {
        theme,
        toggleTheme,
        isThemeLoading
    } = useTheme();

    // Chame o hook useAppColors dentro do componente
    const Colors = useAppColors();
    const CommonStyles = useCommonStyles();
    // Mova a definição dos estilos para dentro do componente
    // Assim, eles serão recriados com as cores atualizadas sempre que o tema mudar
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
        utilButtonGroup: {
            flexDirection: 'column',
            gap: 15,
            alignItems: 'center',
            alignContent: 'center'
        },
        username: {
            marginTop: 10,
            color: Colors.primary, // Agora usa as cores reativas
            fontSize: 24,
        },
        email: {
            color: Colors.text, // Agora usa as cores reativas
            fontSize: 16,
        },
        section: {
            marginBottom: 25,
            backgroundColor: Colors.background, // Agora usa as cores reativas
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
            color: Colors.text, // Agora usa as cores reativas
        },
        authSection: {
            backgroundColor: Colors.background, // Agora usa as cores reativas
            borderRadius: 10,
            padding: 20,
        },
        authTitle: {
            textAlign: "center",
            margin: 20,
            color: Colors.text, // Agora usa as cores reativas
            fontSize: 40,
        },
        authButtons: {
            marginTop: 10,
        },
        text: {
            fontWeight: "bold",
            color: Colors.textOnPrimary,
        },
        exportButtons: {
            width: '60%',
            borderRadius: 10,
            alignItems: 'center',

        },
        buttonTransferir: {
            backgroundColor: Colors.primary, // Agora usa as cores reativas
            padding: 10,
            borderRadius: 10,
        },
        TextTransferir: {
            fontSize: 15,
            fontWeight: '500',
            color: 'white',
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [hasAccount, setHasAccount] = useState(true);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImportComplete, setIsImportComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [duplicates, setDuplicates] = useState<StockShares>({})
    const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState(false);
    const [currentDuplicateTickers, setCurrentDuplicateTickers] = useState<string[]>([]);
    const [resolvedTickers, setResolvedTickers] = useState<{ [ticker: string]: string }>({});
    const handleAuthError = () => {
        setErrorMessage("Houve um erro ao fazer sua autenticação, tente novamente.");
    }
    //Só para o usuário saber que houve uma nova solicitação.
    useEffect(() => {
        if (isLoading) setErrorMessage(null)
    }, [isLoading]);

    const handleLogin = async () => {
        setErrorMessage(null); // Limpa a mensagem de erro antes de iniciar o login
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (e) {
            handleAuthError()
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        setErrorMessage(null); // Limpa a mensagem de erro antes de iniciar o registro
        setIsLoading(true);
        try {
            await register(username, email, password);
            if (userData?.uid) {
                await setDoc(doc(db, "users", userData.uid), {
                    username,
                    email,
                    preferences: {darkMode: theme === 'dark', notifications}, // Use o tema do contexto
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

    const handleReset = async () => {
        setIsLoading(true);
        try {
            await resetLocalData()
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
    const handleLogout = async () => {
        await logout();
        await resetStockData();
    }
    const handleImport = async () => {
        try {
            const imported = await importJSONData();
            const newDuplicates = compareImportedWithCurrent(imported);
            setDuplicates(newDuplicates);

            if (Object.keys(newDuplicates).length > 0) setIsDuplicatesModalOpen(true);
            const tickers = Object.keys(newDuplicates);
            setCurrentDuplicateTickers(tickers);
            console.log(currentDuplicateTickers)
        } catch (e) {
            console.error(e);
        }finally {
            setIsImportComplete(true);
        }
    }
    const cancelImport = ()=>{
        setIsImportComplete(false);
        setIsDuplicatesModalOpen(false)
        setCurrentDuplicateTickers([])
    }
    const keepCurrentStocks =(ticker:string)=>{
        setResolvedTickers(prev =>({...prev,[ticker]:"Mantido o atual"}))
    }
    const overWriteCurrentStocks = (ticker:string)=>{
        updateStockAmount(ticker, duplicates[ticker].quantity);
        setResolvedTickers(prev =>({...prev, [ticker]:"Mantido o importado"}))
    }
    const sumCurrentAndDuplicateStocks = (ticker:string)=>{
        if(!stockShares) {
            console.log('Agora deu o carai');
            return;
        }
        updateStockAmount(ticker, (duplicates[ticker].quantity + stockShares[ticker].quantity));
        setResolvedTickers(prev =>({...prev, [ticker]:"Somado"}))
        console.log(stockShares[ticker]);
    }

    // Opcional: Renderizar um indicador de carregamento enquanto o tema está sendo carregado
    if (isThemeLoading) {
      return (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Carregando tema...</ThemedText>
        </ThemedView>
      );
    }

    return (
      <View style={CommonStyles.overContainer}>

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
                                        value={theme === 'dark'} // Controlado pelo estado 'theme' do contexto
                                        onValueChange={toggleTheme} // Usa a função do contexto para alternar
                                        thumbColor={Colors.primary}
                                        trackColor={{false: "#767577", true: "#81b0ff"}}
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
                                        trackColor={{false: "#767577", true: "#81b0ff"}}
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
                                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                    placeholder="Nome de usuário"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            )}
                            <TextInput
                                style={CommonStyles.input}
                                placeholder="Email"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={[CommonStyles.input, { color: Colors.text }]}
                                placeholder="Senha"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
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
                                                {backgroundColor: Colors.success},
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
                                                {backgroundColor: Colors.warning},
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
                                    <View style={{width: '100%', height: 30}}>

                                        <Banner visible={true}>
                                            <ThemedText style={CommonStyles.warningText}>{errorMessage}</ThemedText>
                                        </Banner>
                                    </View>
                                }
                            </View>

                        </View>
                    )}

                    <View style={styles.utilButtonGroup}>
                        {isAuthenticated &&
                            <Pressable
                                onPress={() => setIsExportDialogOpen(true)}
                                style={({pressed}) => [
                                    styles.buttonTransferir, {backgroundColor: pressed ? Colors.success : Colors.primary}]}>
                                <Text style={styles.TextTransferir}>Transferir dados..</Text>
                            </Pressable>
                        }
                        {isAuthenticated &&
                            <Pressable
                                onPress={handleReset}
                                style={({pressed}) => [
                                    styles.buttonTransferir, {backgroundColor: pressed ? Colors.secondary : Colors.primary}]}>
                                <Text style={styles.TextTransferir}>Apagar dados locais</Text>
                            </Pressable>
                        }
                        {isAuthenticated &&
                            <Pressable
                                onPress={resetStockData}
                                style={({pressed}) => [
                                    styles.buttonTransferir, {backgroundColor: pressed ? Colors.secondary : Colors.primary}]}>
                                <Text style={styles.TextTransferir}>Apagar dados na nuvem</Text>
                        </Pressable>
                        }

                        {isAuthenticated &&
                            <Pressable
                                onPress={handleLogout}
                                style={({pressed}) => [
                                    styles.buttonTransferir, {backgroundColor: pressed ? Colors.exit : Colors.primary}]}>
                                <Text style={styles.TextTransferir}>Sair</Text>
                            </Pressable>
                        }

                    </View>

                </ThemedView>

            )}
            {/*Modal para transferencia de dados*/}
            <CustomModal visible={isExportDialogOpen} title={"Transferir Dados"}
                         onClose={() => setIsExportDialogOpen(false)}>
                <TouchableOpacity style={[styles.exportButtons, {backgroundColor: 'green'}]}
                                  onPress={exportStockSharesToCSV}>
                    <Text style={[CommonStyles.buttonText, {fontSize: 20}]}>{" Para Excel .CSV"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.exportButtons, {backgroundColor: 'orange'}]}
                                  onPress={exportStockSharesToJSON}>
                    <Text style={[CommonStyles.buttonText, {fontSize: 20}]}>{" Para JSON { }"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.exportButtons, {backgroundColor: 'orange'}]} onPress={() => {
                    setIsImportModalOpen(true)
                }}>
                    <Text style={[CommonStyles.buttonText, {fontSize: 20}]}>{" Importar dados JSON { }"}</Text>
                </TouchableOpacity>
            </CustomModal>

            {/*Modal para importação de dados*/}
            <CustomModal title={"Importar dados"} visible={isImportModalOpen} onClose={() => {
                setIsImportModalOpen(false)
            }}>
                <Button title={"abrir arquivo"} onPress={handleImport}/>
            </CustomModal>

            {/*Modal para duplicatas nos Stocks*/}
            <CustomModal title={"Dados Duplicados"} visible={isDuplicatesModalOpen} onClose={cancelImport}>
                <View>
                    <Text style={CommonStyles.warningText}>Existem dados duplicados de uma ou mais ações!</Text>
                </View>
                <ScrollView>
                    {currentDuplicateTickers.map((ticker) => (
                        <View key={ticker}>
                            <View>
                                <Text style={{color: Colors.text}}>{ticker.toUpperCase()}</Text>
                                <Text style={{color: Colors.text}}>Qtde atual: {!(stockShares) || stockShares[ticker]?.quantity}</Text>
                                <Text style={{color: Colors.text}}>Qtde importada: {duplicates[ticker]?.quantity}</Text>
                            </View>

                            <View style={styles.preferenceItem}>
                                <Button title={"Manter atuais"} onPress={()=>{keepCurrentStocks(ticker)}}/>
                                <Button title={"Somar total"} onPress={()=>{sumCurrentAndDuplicateStocks(ticker)}}/>
                                <Button title={"Manter importados"} onPress={()=>{overWriteCurrentStocks(ticker)}}/>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </CustomModal>

            <CustomModal visible={isImportComplete} onClose={cancelImport} title={'Concluído'}>
                <Text style={CommonStyles.warningText}>Importação de dados concluída com sucesso!</Text>
                <Image style={{width:100,height:100}} source={require('@/assets/images/ok.webp')}/>
            </CustomModal>

        </ScrollView>
        <AdBanner/>
        </View>
    );
}
