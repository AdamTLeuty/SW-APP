import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";

import Viewfinder from "@/components/Viewfinder";

//import { useRoute } from "@react-navigation/native";

export default function Camera() {
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

  return (
    <View style={styles.container}>
      <Viewfinder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins_Bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
