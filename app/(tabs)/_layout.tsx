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
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="portfolios"
            options={{
              title: 'Portfolios',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'briefcase' : 'briefcase-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: `${userData?('Profile'):('Login/SignUp')}`,
              tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused? 'happy' : 'happy-outline'} color={color} />
              ),
            }}/>

        </Tabs>
      );
    }
