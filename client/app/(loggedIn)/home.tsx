import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { ScrollView, Text, Title, View, Button } from "@/components/Themed";
import { universalStyles as styles } from "@/constants/Styles";
import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { Icon } from "@/components/Icon";
import Calendar from "@/components/Calendar";
import Progress from "@/components/progress";
import { Image } from "expo-image";
import { RefreshControl } from "react-native";
import Countdown from "@/components/Countdown";

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
        <Title style={styles.bottomMargin} lightColor="#000">
          WELCOME TO THE SMILE&nbsp;WHITE PORTAL!
        </Title>
        <Link style={[styles.progressHolder, styles.bottomMargin]} href="/progress">
          {/*  <Progress text="Progress Bar" currentAlignerCount={alignerProgress} totalAlignerCount={alignerCount} /> */}
        </Link>
        <Countdown timerPercentage={100} changeDate={new Date(Date.parse(alignerChangeDate))} />

        {changeDate < now ? (
          <Link href="/aligner-change-modal" asChild>
            <Button lightColor="#FF005C" darkColor="#FF005C">
              {alignerProgress > 0 ? "It's time to change your aligners" : "It's time to start your first aligners"}
            </Button>
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

/*


*/

interface Content_LinkProps {}

const Content_Link: React.FC<Content_LinkProps> = () => {
  const image = require("@/assets/images/content.png");

  return (
    <View style={styles.content_link}>
      <Image style={styles.image} source={image} contentFit="cover" transition={1000} />
      <View style={styles.content_right}>
        <Text style={styles.contentHeading} lightColor="#fff" fontWeight="700">
          {"Share your\n smile with us\nand earn"}
        </Text>
        <View style={styles.contentButton}>
          <Text style={styles.contentButtonText} lightColor="#000" darkColor="#000" fontWeight="600">
            {"Get started now"}
          </Text>
        </View>
      </View>
    </View>
  );
};
