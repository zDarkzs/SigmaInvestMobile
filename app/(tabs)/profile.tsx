    import Ionicons from '@expo/vector-icons/Ionicons';
    import {StyleSheet, Image, Platform, TextInput, Button, View} from 'react-native';

    import { Collapsible } from '@/components/Collapsible';
    import { ExternalLink } from '@/components/ExternalLink';
    import ParallaxScrollView from '@/components/ParallaxScrollView';
    import { ThemedText } from '@/components/ThemedText';
    import { ThemedView } from '@/components/ThemedView';
    import {useState} from "react";
    import {useAuth} from "@/context/AuthContext";

    export default function TabThreeScreen() {
        const  {token, isAuthenticated,login, register, userData} = useAuth();
        const  [username, setUsername] = useState<string>('');
        const [password, setPassword] = useState<string>('');
        const [email, setEmail] = useState<string>('');
        const [debug, setDebug] = useState<boolean>(true);

        const handleLogin = async () => {
           await login(username, password);
        }
        const debugHandleLogin = async () => {
            await login('fabio','fabio@aluno');
        }
        const handleRegister = async () =>{
            await register(username,email,password);
        }


      return (
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
          headerImage={
            isAuthenticated?(
                <Image source={{uri:''}} style={styles.headerImage}/>
                ):(
            <Ionicons size={310} name="happy-outline" style={styles.headerImage} />
            )}>
            {isAuthenticated?(
                <>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Bem vindo{userData&&userData.username?(","+ userData.username):('')}!</ThemedText>
                    <ThemedText>{token?(token):("token não carregado")}</ThemedText>
                </ThemedView>
                </>
            ):(
                <>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type="title">Profile</ThemedText>
                    </ThemedView>
                    <View style={styles.inputFormHolder}>

                    <View style={styles.inputForm}>
                    <ThemedText>Faça login para obter mais funções.</ThemedText>
                        {debug?(<Button title='LOGAR COMO BETINHA' onPress={debugHandleLogin}/>):('')}

                    <TextInput
                        style={styles.input}
                        placeholder="email"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Button title='login' onPress={handleLogin}/>
                    </View>
                    <View style={styles.inputForm}>
                        <ThemedText>Ou crie uma conta.</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="username"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="default"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Button title='register' onPress={handleRegister}/>
                    </View>
                    </View>
                </>
            )}

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
      input:{
          width: '50%',
          backgroundColor:'#555555',
          borderRadius:6,
          padding:10,
          marginVertical:5,
          fontWeight:'bold',
          color:'white',
      },
      inputForm:{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent:'space-around',

      },
      inputFormHolder:{
          flexDirection:'column',
          width:'70%',
      }
    });
