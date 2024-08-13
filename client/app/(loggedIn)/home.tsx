import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { Icon } from "@/components/Icon";
import Calendar from "@/components/Calendar";
import Progress from "@/components/progress";

import { Pressable } from "react-native";

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
      <Button title="Sign Out" onPress={handleLogout} />
      <Text style={styles.title} textBreakStrategy="balanced" lightColor="#000" fontWeight="800">
        Welcome to the Smile&nbsp;Correct&nbsp;Club Portal!
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Progress text="Progress Bar" currentAlignerCount={25} totalAlignerCount={30} />
      <Link href="/aligner-change-modal" asChild>
        <Pressable style={styles.alignerChangeButton}>
          <Text style={styles.alignerChangeText} lightColor="#fff" fontWeight="600">
            {"Time to change your aligners"}
          </Text>
        </Pressable>
      </Link>
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
  alignerChangeButton: {
    borderRadius: 47,
    backgroundColor: "#FF005C",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginVertical: 36.5,
    textAlign: "center",
  },
  alignerChangeText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 29,
  },
});
