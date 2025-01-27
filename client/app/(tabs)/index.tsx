import React, { StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import RegisterArea from "@/components/RegisterArea";
import { Text, View, Title, KeyboardAvoidingView, ScrollView, Button } from "@/components/Themed";
import Colors from "@/constants/Colors";
import Toast from "react-native-toast-message";

import { useEffect, useState } from "react";

import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { universalStyles } from "@/constants/Styles";
import { useAuth } from "@/context/AuthContext";

export default function SignInScreen() {
  const { authTokens, promptAsync, logout } = useAuth();
  return (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.container}>
          <Title lightColor={"#000"} darkColor={"#fff"}>
            Log in
          </Title>
          <Text style={styles.greeting} lightColor={Colors.light.tint} darkColor={Colors.dark.tint} fontWeight={"700"} textBreakStrategy="balanced">
            Please enter the email you gave us when you booked your consultation.
          </Text>
          <LoginArea />
          <Text style={styles.orText}>Or</Text>
          <Pressable>
            <Text style={styles.registerText} lightColor="#4378ff" darkColor="#ffffff" onPress={() => router.replace("/register")}>
              Register
            </Text>
          </Pressable>
          <View>
            {authTokens ? (
              <>
                <Text>Welcome! {authTokens.accessToken}</Text>
                <Button onPress={logout}>Logout</Button>
              </>
            ) : (
              <Button onPress={() => promptAsync()}>Login/Register</Button>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    height: "100%",
    padding: 27,
    fontSize: 25,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 14,
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
