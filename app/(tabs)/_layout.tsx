import { Tabs } from "expo-router";
import React, {useState} from "react";
import {StyleSheet, Platform, View, Text} from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAppColors } from "@/constants/Colors";
import { useCommonStyles } from "@/hooks/useCommonStyles";
import { useAuth } from "@/context/AuthContext";
import Banner from "@/components/Banner";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const [bannerHeight, setBannerHeight] = useState(0);

  const Colors = useAppColors();
  const commonStyles = useCommonStyles();
  const getMargin = ()=>{
    return 0;
  }

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: Colors.background,
      borderTopColor: Colors.divider,
      borderTopWidth: 1,
      height: 60,
      paddingBottom: 5,
      marginBottom: getMargin(),
    },
    tabBarLabel: {
      fontSize: 12,
      fontWeight: "500",
      marginBottom: 5,
      color: Colors.text,
    },
    tabBarIcon: {
      marginBottom: -1,
      color: Colors.text,
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

  return (
    <>
      <Banner
        visible={!isAuthenticated}
        onHeightChange={(h) => setBannerHeight(h)}
      >
        <Text style={styles.text}>Modo Offline</Text>
      </Banner>

      {/* Aplica o padding top na View que envolve o Tabs para afastar do banner */}
      {/* Esta View é um irmão de Tabs, e não um filho direto, o que é permitido. */}
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
        {/* REMOVIDO: <ThemedText> Teste</ThemedText> - Este era o problema! */}

        <Tabs.Screen
          name="index"
          options={{
            title: "Ativos",
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
