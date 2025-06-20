import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Platform } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function TabLayout() {
  const { userData } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Proventos",
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
        name="portfolios"
        options={{
          title: "Ativos",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "business" : "business-outline"}
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
  );
}
const getMargin = ()=>{
    if(Platform.OS !== "web") return 50;
    return 0;
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
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
});
