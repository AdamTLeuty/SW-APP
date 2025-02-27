import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, Title } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import Colors from "@/constants/Colors";

//import { useRoute } from "@react-navigation/native";

export default function Content() {
  return (
    <View style={styles.container} lightColor={Colors.light.background} darkColor={Colors.dark.background}>
      <Title>Content creation</Title>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.content} lightColor="#c0c0c0">
        Coming soon...
      </Text>
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  content: {},
});
