import React, { StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import RegisterArea from "@/components/RegisterArea";
import { Text, View, Title, KeyboardAvoidingView, ScrollView, Button } from "@/components/Themed";
import Colors from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { useUserContext } from "@/components/userContext";

import { useEffect, useState } from "react";

import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { universalStyles } from "@/constants/Styles";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function SignInScreen() {
  const { authTokens, promptAsync, logout } = useAuth();
  const { oauthTokens, setOauthTokens, login } = useUserContext();

  useEffect(() => {
    if (authTokens) {
      setOauthTokens(authTokens);
    }
  }, [authTokens]);

  useEffect(() => {
    if (oauthTokens.idToken != null) {
      console.log("TOKENS IN USER CONTEXT: ", oauthTokens);
      const userEmail = jwtDecode(oauthTokens.idToken).email;
      if (userEmail) {
        console.log("User email:", userEmail);
        login(userEmail);
      } else {
        console.error("No email in token");
      }
    } else {
      console.error(oauthTokens);
      console.log(oauthTokens);
    }
  }, [oauthTokens]);

  return (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.container}>
          <Title lightColor={"#000"} darkColor={"#fff"}>
            Log in
          </Title>
          <Text style={styles.greeting} lightColor={Colors.light.tint} darkColor={Colors.dark.tint} fontWeight={"700"} textBreakStrategy="balanced">
            Please use the email you used for your aligner e-consultation.
          </Text>
          <View style={{ paddingVertical: 75 }}>
            {authTokens ? (
              <>
                <Button onPress={logout}>Logout</Button>
              </>
            ) : (
              <Button style={{ minWidth: "50%", textAlign: "center", justifyContent: "center", alignItems: "center" }} onPress={() => promptAsync()}>
                Login
              </Button>
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
