import { StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View } from "@/components/Themed";
import RegisterArea from "@/components/RegisterArea";
import { router } from "expo-router";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title} fontWeight={"800"} lightColor={"#000"} darkColor={"#fff"}>
        Register
      </Text>
      <Text style={styles.greeting} lightColor={"#000"} darkColor={"#FFFFFF"} fontWeight={"500"} textBreakStrategy="balanced">
        Time to create your scc hub account to track your smile transformation
      </Text>
      <RegisterArea />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 27,
    fontSize: 25,
  },
  title: {
    fontSize: 20,
    marginBottom: 29,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  greeting: {
    fontSize: 18,
    textAlign: "center",
    margin: 7,
  },
  orText: {
    fontSize: 16,
    marginVertical: 14,
    padding: 0,
    textAlign: "center",
    width: "100%",
  },
  registerText: {
    textAlign: "center",
    fontSize: 16,
    textDecorationStyle: "solid",
    textDecorationColor: "#5700ff",
    textDecorationLine: "underline",
  },
});
