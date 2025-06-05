    import { Tabs } from 'expo-router';
    import React from 'react';

    import { TabBarIcon } from '@/components/navigation/TabBarIcon';
    import { Colors } from '@/constants/Colors';
    import { useColorScheme } from '@/hooks/useColorScheme';
    import {useAuth} from "@/context/AuthContext";

    export default function TabLayout() {
      const colorScheme = useColorScheme();
      const logged = false
        const {userData} = useAuth();
      if(logged){
          return (
               <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
          }}>

                 <Tabs.Screen
                name="login"
                options={{
                    title:'Login'
            }}/>
            <Tabs.Screen
                name="signup"
                options={{
                    title: 'Sign Up'
            }}/>

          </Tabs>
          )
      }
      return (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
          }}>

          <Tabs.Screen
            name="index"
            options={{
              title: 'Proventos',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'download' : 'download-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="portfolios"
            options={{
              title: 'Ativos',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'business' : 'business-outline'} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="dashboard"
            options={{
              // title: `${'Dashboard'}`,
              title: 'Historico',
              tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} />
              ),
            }}/>

          <Tabs.Screen
            name="profile"
            options={{
              // title: `${userData?('Profile'):('Login/SignUp')}`,
              title: 'Configuração' ,
              tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
              ),
            }}/>
           

        </Tabs>
      );
    }
