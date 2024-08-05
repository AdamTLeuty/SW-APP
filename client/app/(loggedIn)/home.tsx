import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { TrayIcon } from "@/components/Icon";
import Calendar from "@/components/Calendar";

//import { useRoute } from "@react-navigation/native";

export default function Home() {
  const { isLoggedIn, logout } = useUserContext();
  //const routeTest = useRoute();

  useEffect(() => {
    //console.log("Current route:", routeTest.name);
    if (!isLoggedIn) {
      //console.log("Before the routing change");
      console.log("The token is: " + getToken());
      router.replace("/(tabs)");
      //console.log("After the routing change");
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} textBreakStrategy="balanced" fontWeight="800">
        Welcome to the Smile&nbsp;Correct&nbsp;Club Portal!
      </Text>
      <Calendar rows={1} title="Your progress" />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>Welcome to the SCC Portal home.</Text>

      <Button title="Sign Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Poppins_Bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
