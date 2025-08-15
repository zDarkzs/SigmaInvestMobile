// components/OfflineBanner.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, ViewStyle } from "react-native";

// Banner.tsx
interface OfflineBannerProps {
  visible: boolean;
  children: React.ReactNode;
  onHeightChange?: (height: number) => void; // <-- adicionado
}

export default function Banner({ visible, children, onHeightChange }: OfflineBannerProps) {
  const slideAnim = useRef(new Animated.Value(-50)).current;

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    onHeightChange?.(height);
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -50,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[
        styles.banner,
        { transform: [{ translateY: slideAnim }] } as ViewStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    alignItems: "center",
    zIndex: 999,
  },
  text: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
