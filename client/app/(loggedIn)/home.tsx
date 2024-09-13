import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { ScrollView, Text, View } from "@/components/Themed";
import { universalStyles as styles } from "@/constants/Styles";
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
        <Text style={[styles.title, styles.bottomMargin]} textBreakStrategy="balanced" lightColor="#000" fontWeight="800">
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
