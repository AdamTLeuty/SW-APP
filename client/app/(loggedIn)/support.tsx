import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";

import LogoLinkCard from "@/components/logoLinkCard";

//import { useRoute } from "@react-navigation/native";

export default function Support() {
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
      <Text style={styles.title}>Customer Support</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.content}>We want to make sure that you have the best experience from start to finish.</Text>
      <View style={styles.supportCards}>
        <LogoLinkCard text="Call Us" iconName="mail" link="tel:${03308226507}" linkType="phone" />
        <LogoLinkCard text="Email Us" iconName="phone" link="mailto:info@smilecorrectclub.co.uk" linkType="mail" />
        <LogoLinkCard text="Contact Us" iconName="support" link="https://www.example.com" linkType="web" />
      </View>
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
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins_Bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  supportCards: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  content: {},
});
