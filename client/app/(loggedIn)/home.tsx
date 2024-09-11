import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { ScrollView, Text, View } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { Icon } from "@/components/Icon";
import Calendar from "@/components/Calendar";
import Progress from "@/components/progress";
import { Image } from "expo-image";
import { RefreshControl } from "react-native";

import { Pressable } from "react-native";

//import { useRoute } from "@react-navigation/native";

export default function Home() {
  const { alignerProgress, alignerCount, updateUserContext, alignerChangeDate } = useUserContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await updateUserContext();
    setRefreshing(false);
  }, []);

  const now = new Date();
  const changeDate = new Date(Date.parse(alignerChangeDate));

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <Text style={styles.title} textBreakStrategy="balanced" lightColor="#000" fontWeight="800">
          Welcome to the Smile&nbsp;Correct&nbsp;Club Portal!
        </Text>
        <Link style={styles.progressHolder} href="/progress">
          <Progress style={styles.progressHolder} text="Progress Bar" currentAlignerCount={alignerProgress} totalAlignerCount={alignerCount} />
        </Link>

        {changeDate < now ? (
          <Link href="/aligner-change-modal" asChild>
            <Pressable style={styles.alignerChangeButton}>
              <Text style={styles.alignerChangeText} lightColor="#fff" fontWeight="600">
                {alignerProgress > 0 ? "Time to change your aligners" : "Time to start your first aligners"}
              </Text>
            </Pressable>
          </Link>
        ) : (
          <Text>{}</Text>
        )}
        <Link href="/content">
          <Content_Link />
        </Link>
      </View>
    </ScrollView>
  );
}

interface Content_LinkProps {}

const Content_Link: React.FC<Content_LinkProps> = () => {
  const image = require("@/assets/images/content.png");

  return (
    <View style={styles.content_link}>
      <Image style={styles.image} source={image} contentFit="cover" transition={1000} />
      <View style={styles.content_right}>
        <Text style={styles.contentHeading} lightColor="#fff" fontWeight="700">
          {"Earn & create\nContent from\nyour journey"}
        </Text>
        <View style={styles.contentButton}>
          <Text style={styles.contentButtonText} lightColor="#000" fontWeight="600">
            {"Get started now"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content_link: {
    width: "100%",
    minHeight: 200,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    backgroundColor: "#0553",
    flexShrink: 1,
  },
  content_right: {
    flexGrow: 1,
    backgroundColor: "#5700FF",
    alignItems: "center",
    justifyContent: "center",
    gap: 19,
  },
  contentHeading: {
    fontSize: 22,
    lineHeight: 26,
    textAlign: "center",
  },
  contentButton: {
    borderRadius: 64,
    backgroundColor: "#fff",
    paddingHorizontal: 19,
    paddingVertical: 10,
    marginHorizontal: 19,
  },
  contentButtonText: {
    fontSize: 14,
    lineHeight: 21,
  },

  containerHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
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
    marginBottom: 22,
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
  progressHolder: {
    width: "100%",
  },
});
