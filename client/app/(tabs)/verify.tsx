import { StyleSheet } from "react-native";
import React from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, Title, KeyboardAvoidingView, ScrollView } from "@/components/Themed";
import RegisterArea from "@/components/RegisterArea";
import { router } from "expo-router";
import { TextBase } from "react-native";
import VerifyArea from "@/components/VerifyArea";
import { universalStyles } from "@/constants/Styles";

interface Props {
  text: String;
  currentAlignerCount: number;
  totalAlignerCount: number;
}

export default function VerifyScreen() {
  return (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.container}>
          <Title style={universalStyles.bottomMargin} lightColor={"#000"} darkColor={"#fff"}>
            Verify your email
          </Title>
          <Text style={styles.greeting} lightColor={"#000"} darkColor={"#FFFFFF"} fontWeight={"500"} textBreakStrategy="balanced">
            Please check your email for a six digit code.
          </Text>
          <VerifyArea />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    textDecorationColor: "#4378ff",
    textDecorationLine: "underline",
  },
});
