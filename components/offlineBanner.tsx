// components/OfflineBanner.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, ViewStyle } from "react-native";

interface OfflineBannerProps {
  visible: boolean;
}

export default function OfflineBanner({ visible }: OfflineBannerProps) {
  const slideAnim = useRef(new Animated.Value(-50)).current; // começa fora da tela

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -50, // aparece ou desaparece
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY: slideAnim }] } as ViewStyle,
      ]}
    >
      <Text style={styles.text}>Modo Offline</Text>
      <Text style={styles.text}>Faça login para sincronizar dados</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffc107",
    paddingVertical: 10,
    alignItems: "center",
    zIndex: 999,
  },
  text: {
    fontWeight: "bold",
    color: "#333",
  },
});
