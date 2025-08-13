import { View, type ViewProps } from 'react-native';

import {useAppColors} from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function  ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useAppColors().background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
