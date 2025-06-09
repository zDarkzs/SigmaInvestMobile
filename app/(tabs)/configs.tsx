import { useState } from 'react';
import { StyleSheet, Image, TextInput, View, TouchableOpacity, Switch, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { Alert } from 'react-native';

export default function SettingsScreen() {
  const { isAuthenticated, login, register, userData, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [bio, setBio] = useState<string>(userData?.profile?.bio || '');
  const [hasAccount, setHasAccount] = useState<boolean>(true);
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(username, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      console.log(username)
      console.log(email)
      console.log(password)
      await register(username, email, password);
      // Salva dados adicionais no Firebase após registro
      if (userData?.uid) {
        await setDoc(doc(db, "users", userData.uid), {
          username,
          email,
          preferences: {
            darkMode,
            notifications
          },
          profile: {
            bio: "",
            user_since: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao registrar: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!userData?.uid) return;
    
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "users", userData.uid), {
        "profile.bio": bio,
        preferences: {
          darkMode,
          notifications
        }
      });
      Alert.alert("Sucesso", "Configurações salvas!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1A237E', dark: '#121858' }}
      headerImage={
        <Image
          source={require('@/assets/images/sigmainvest outline.png')}
          style={styles.headerImage}
        />
      }>
      
      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Carregando...</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.container}>
          {isAuthenticated ? (
            <>
              <ThemedView style={styles.profileHeader}>
                <Ionicons name="person-circle" size={80} color="#1A237E" />
                <ThemedText type="title" style={styles.username}>
                  {userData?.username}
                </ThemedText>
                <ThemedText style={styles.email}>{userData?.email}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText type="subtitle">Preferências</ThemedText>
                
                <View style={styles.preferenceItem}>
                  <ThemedText>Modo Escuro</ThemedText>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    thumbColor="#1A237E"
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                  />
                </View>

                <View style={styles.preferenceItem}>
                  <ThemedText>Notificações</ThemedText>
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    thumbColor="#1A237E"
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                  />
                </View>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText type="subtitle">Perfil</ThemedText>
                <TextInput
                  style={styles.bioInput}
                  placeholder="Escreva algo sobre você"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                />
              </ThemedView>

              <View style={styles.buttonsContainer}>
                <Button 
                  title="Salvar Configurações" 
                  onPress={updateProfile}

                />
                <Button 
                  title="Sair" 
                  onPress={logout}

                />
              </View>
            </>
          ) : (
            <>
              <ThemedView style={styles.authSection}>
                <ThemedText type="title" style={styles.authTitle}>
                  Acesse sua conta
                </ThemedText>
                {!hasAccount&&(
                    <TextInput
                  style={styles.input}
                  placeholder="Nome de usuário"
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="default"
                  autoCapitalize="none"
                />
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <View style={styles.authButtons}>
                {hasAccount ? (
                  <>
                  <Button
                    title="Entrar"
                    onPress={handleLogin}
                  />

                  <Button
                    title='Criar conta...'
                    onPress={()=> {setHasAccount(!hasAccount)}}
                  />
                  </>

                ):(
                    <>
                  <Button
                    title="Registrar"
                    onPress={handleRegister}
                  />

                  <Button
                    title='Entrar em conta existente...'
                    onPress={()=> {setHasAccount(!hasAccount)}}
                  />
                  </>
                )
                }
                </View>

              </ThemedView>
            </>
          )}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerImage: {
    height: 150,
    width: 150,
    bottom: -50,
    left: -20,
    position: 'absolute',
    tintColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    marginTop: 10,
    color: '#1A237E',
    fontSize: 24,
  },
  email: {
    color: '#666',
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bioInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#1A237E',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#E53935',
  },
  authSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
  },
  authTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A237E',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  authButtons: {
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#1A237E',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#388E3C',
  },
});