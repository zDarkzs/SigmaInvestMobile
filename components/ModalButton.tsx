import {Colors} from "@/constants/Colors";
import {Pressable,StyleSheet, Text} from "react-native";
import React from "react";


export default function ModalButton(props: {
  onPress: () => void;
  title: string;
}){
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
      styles.Button,{ backgroundColor: pressed ? Colors.text : "#666" } ]}>
      <Text style={styles.Text}>{props.title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    Button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  Text: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',

  },
})


