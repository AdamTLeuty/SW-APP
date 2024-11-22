import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";

import { TouchableOpacity } from "react-native";
import { Icon } from "@/components/Icon";

import Viewfinder from "@/components/Viewfinder";

import { useRouter } from "expo-router";

//import { useRoute } from "@react-navigation/native";

export default function Camera() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Viewfinder />
      <TouchableOpacity style={styles.backButton} activeOpacity={0.5} onPress={goBack}>
        <Icon iconName="back-arrow" color={Colors.light.button} />
      </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    top: 100,
    left: 20,
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
