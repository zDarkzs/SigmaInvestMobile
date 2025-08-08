import { Tabs } from "expo-router";
import React, {useState} from "react";
import {StyleSheet, Platform, View, Text} from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {ThemedText} from "@/components/ThemedText";
import Banner from "@/components/Banner";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const [bannerHeight, setBannerHeight] = useState(0); // <-- armazenar altura

  return (
    <>
      <Banner
        visible={!isAuthenticated}
        onHeightChange={(h) => setBannerHeight(h)} // <-- callback para altura
      >
        <Text style={styles.text}>Modo Offline</Text>
      </Banner>

      {/* Aplicar o padding top com base na altura real */}
      <View style={{ paddingTop: !isAuthenticated ? bannerHeight : 0 }} />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <ThemedText> Teste</ThemedText>
      <Tabs.Screen
        name="index"
        options={{
          title: "Proventos",
            animation:'shift',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "download" : "download-outline"}
              color={color}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Histórico",
            animation:'shift',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={color}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="configs"
        options={{
          animation:'shift',
          title: "Configuração",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
    </Tabs>
      </>
  );
}
const getMargin = ()=>{
    //if(Platform.OS !== "web") return 50;
    return 0;
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.divider,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 5,
      marginBottom:getMargin(),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 5,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
    offlineBanner: {
    backgroundColor: "#ffcc00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  offlineText: {
    color: "#fff",
    fontWeight: "bold",
  },
    text: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
