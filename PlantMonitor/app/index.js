import { StyleSheet, Text, View, ScrollView } from "react-native";

import Widget from '../components/Widget';
import UpdateButton from '../components/UpdateButton';

export default function Page() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.page}>
        <Text style={styles.title}>Plant Health</Text>
        <Text style={styles.subtitle}>Plant chosen: Basil</Text>
        <View style={styles.widgetGap} />
        <UpdateButton></UpdateButton>
        <View style={styles.widgetContainer}>
          <Widget theme="water" label="Water"></Widget>
          <View style={styles.widgetGap} />
          <Widget theme="temperature" label="Temperature"></Widget>
          <View style={styles.widgetGap} />
          <Widget theme="lighting" label="Lighting"></Widget>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    padding: 24,
    backgroundColor: '#CAD8CC',
    width: '100%',
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: "bold",
    paddingBottom: 5,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#38434D",
  },
  widgetContainer: {
    paddingTop: 25,
    alignItems: 'center',
  },
  widgetGap: {
    height: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
