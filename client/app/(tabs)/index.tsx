import { StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, Title } from "@/components/Themed";

import { useEffect, useState } from "react";

import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { universalStyles } from "@/constants/Styles";

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      <Title style={universalStyles.bottomMargin} lightColor={"#000"} darkColor={"#fff"}>
        Log in
      </Title>
      <Text style={styles.greeting} lightColor={"#000"} darkColor={"#FFFFFF"} fontWeight={"500"} textBreakStrategy="balanced">
        Please enter the email you gave us when you booked your consultation.
      </Text>
      <LoginArea />
      <Text style={styles.orText}>Or</Text>
      <Pressable>
        <Text style={styles.registerText} lightColor="#5700ff" darkColor="#ffffff" onPress={() => router.replace("/register")}>
          Register
        </Text>
      </Pressable>
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
