// ‘How to use Fetch API with React Native?’, Rapid API Guides. Accessed: Mar. 27, 2024. [Online]. 
// Available: https://rapidapi.com/guides/fetch-api-react-native


import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

let bgcolour
let unit

export default function Widget({ label, theme }) {

  const [score, setScore] = useState(null);

  useEffect(() => {
    getSensorValues();
  }, []);

  // Get sensor values
  const getSensorValues = async () => {
    try {
      const response = await fetch("http://192.168.185.191:3000"); // dockerised api
      const dataArray = await response.json();
      const data = dataArray[0];

      // Set score based on theme
      if (theme == "water") {
        setScore(data.moisture);
      } else if (theme == "temperature") {
        setScore(data.temperature);
      } else if (theme == "lighting") {
        setScore(data.lighting);
      }
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  // Set background colour based on theme
  if (theme == "water") { 
    bgcolour = "#01A6E8";
    unit = "Percentage (%)";
  } else if (theme == "temperature") {
    bgcolour = "#E44C49";
    unit = "Celsius (°C)";
  } else if (theme == "lighting") {
    bgcolour = "#E86826";
    unit = "Lux (lx)";
  }


  return (
    <View>
      <View style={[styles.container, { backgroundColor: bgcolour }]}>
        <Text style={[styles.title]}>{label}</Text>
        <Text style={[styles.score]}>{score}</Text>
        <Text style={[styles.unit]}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
  },
  score: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
  },
  unit: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});
