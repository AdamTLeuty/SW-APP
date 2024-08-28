import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { useRef } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, ScrollView } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { Icon } from "@/components/Icon";
import Calendar from "@/components/Calendar";
import Progress from "@/components/progress";

import { Pressable } from "react-native";

import { Status } from "@/components/userContext";

//import { Audio, Video } from "expo-av";

//import { useRoute } from "@react-navigation/native";

export default function Home() {
  const { isLoggedIn, logout, nextStage } = useUserContext();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title} textBreakStrategy="balanced" lightColor="#000" fontWeight="800">
          Welcome to the Smile&nbsp;Correct&nbsp;Club Portal!
        </Text>
        <View style={styles.separator} />

        <Link href="/impressionsProcessPage" asChild>
          <Pressable style={styles.impressionsButton}>
            <Text style={styles.impressionsButtonText} lightColor="#fff" fontWeight="800">
              {"Impressions tutorial"}
            </Text>
          </Pressable>
        </Link>
        <Text lightColor="black" style={styles.body} fontWeight="400">
          {"More features will be unlocked once we send you your aligners"}
        </Text>
        <Text fontWeight="600" style={styles.subheading}>
          {"Already have your aligners?"}
        </Text>

        <Pressable
          onPress={() => {
            nextStage();
          }}
          style={styles.homeButton}
        >
          <Text style={styles.impressionsButtonText} lightColor="#fff" fontWeight="800">
            {"Take me to the aligner stage!"}
          </Text>
        </Pressable>

        <Link href="/impressions_result" asChild>
          <Pressable style={styles.homeButton}>
            <Text style={styles.impressionsButtonText} lightColor="#fff" fontWeight="800">
              {"Impression check results"}
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ScrollViewStyle: {
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 22,
  },
  separator: {
    marginVertical: 22,
    height: 1,
    width: "80%",
  },
  impressionsButton: {
    borderRadius: 47,
    backgroundColor: "#FF005C",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 22,
    textAlign: "center",
  },
  homeButton: {
    borderRadius: 47,
    backgroundColor: "#5700FF",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 22,
    textAlign: "center",
  },
  impressionsButtonText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 29,
  },
  subheading: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: "center",
    marginBottom: 22,
  },
  body: { fontSize: 14, lineHeight: 21, textAlign: "center", marginBottom: 22 },
});
