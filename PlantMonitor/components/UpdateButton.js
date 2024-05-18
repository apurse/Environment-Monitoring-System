import React from "react";
import { StyleSheet, View, Pressable, Text, Alert } from "react-native";

export default function UpdateButton() {

  // Call Seeeduino
  const callSeeeduino = async () => {
    try {
      await fetch("http://192.168.185.64/"); // seeeduino esp server
    }
    catch (error) {
      console.error("Error calling Seeeduino:", error);
    }
  };

  return (
    <View>
      <Pressable onPress={callSeeeduino}> 
        <View style={[styles.container]}>
          <Text style={[styles.title]}>Update Values</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 50,
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 3,
  },
  title: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});
