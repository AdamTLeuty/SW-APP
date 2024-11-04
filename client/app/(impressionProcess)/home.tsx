import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { useRef } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, ScrollView, Title, Button } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { Icon } from "@/components/Icon";
import Calendar from "@/components/Calendar";
import Progress from "@/components/progress";
import { RefreshControl } from "react-native";
import Toast from "react-native-toast-message";

import { Status } from "@/components/userContext";
import { universalStyles } from "@/constants/Styles";

//import { Audio, Video } from "expo-av";

//import { useRoute } from "@react-navigation/native";

export default function Home() {
  const { isLoggedIn, logout, nextStage, updateUserContext, canChangeStage, impressionConfirmation } = useUserContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await updateUserContext();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <Title lightColor="#000">WELCOME TO THE SMILE&nbsp;CORRECT&nbsp;CLUB PORTAL!</Title>
        <View style={styles.separator} />
        <Link href="/impressionsProcessPage" asChild>
          <Button>{"Show me how to take impressions"}</Button>
        </Link>
        <Text lightColor="black" style={styles.body} fontWeight="400">
          {"More features will be unlocked once we send you your aligners"}
        </Text>
        {canChangeStage && (
          <>
            <Button
              onPress={() => {
                nextStage();
              }}
              lightColor="#FF005C"
              darkColor="#FF005C"
            >
              {"I’ve already got my aligners"}
            </Button>
          </>
        )}
        {impressionConfirmation != "unset" && (
          <>
            <Link href="/impressions_result" asChild>
              <Button>{"Check my impressions results"}</Button>
            </Link>
          </>
        )}
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
