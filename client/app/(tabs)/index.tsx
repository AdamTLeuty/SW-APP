import React, { StyleSheet, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import RegisterArea from "@/components/RegisterArea";
import { Text, View, Title, KeyboardAvoidingView, ScrollView, Button } from "@/components/Themed";
import Colors from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { useUserContext } from "@/components/userContext";
import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import * as Linking from "expo-linking";
import { Link, router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { universalStyles } from "@/constants/Styles";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { ActivityIndicator } from "react-native";

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
    <View lightColor={Colors.tint} darkColor={Colors.tint} style={styles.container}>
      <Text lightColor={"white"} darkColor={"white"}>
        Welcome to
      </Text>
      <Icon style={{ marginTop: 9, marginBottom: 43 }} iconName="logo-wide" color={"white"} width={"231"} height={"34"} />
      <Button
        lightColor={"white"}
        darkColor={"white"}
        style={{ minWidth: "77%", width: "auto", justifyContent: "center", alignItems: "center" }}
        onPress={authTokens ? () => {} : () => promptAsync()}
      >
        {authTokens ? (
          <ActivityIndicator size="small" color={Colors.light.text} />
        ) : (
          <Text lightColor={Colors.light.text} darkColor={Colors.light.text}>
            {"Log in/Sign up"}
          </Text>
        )}
      </Button>
      <Text lightColor={"white"} darkColor={"white"}>
        {"Having trouble logging in?"}
      </Text>
      <Pressable
        onPress={() => {
          Linking.openURL("tel:${01138687615}").catch((err) => {
            Alert.alert("Error", "Unable to open dialer");
            console.log("Could not open dialer" + err);
          });
        }}
      >
        <Text style={{ marginTop: 5, textDecorationStyle: "solid", textDecorationLine: "underline" }} lightColor={"white"} darkColor={"white"} fontWeight="700">
          {"Get help signing in"}
        </Text>
      </Pressable>
    </View>
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
