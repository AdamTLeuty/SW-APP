import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { ScrollView, Text, Title, View, Button } from "@/components/Themed";
import { universalStyles as styles, universalStyles } from "@/constants/Styles";
import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { Icon } from "@/components/Icon";
import Calendar from "@/components/Calendar";
import Progress from "@/components/progress";
import { Image } from "expo-image";
import { RefreshControl } from "react-native";
import Countdown from "@/components/Countdown";
import Colors from "@/constants/Colors";
import Card from "@/components/Card";
import ToDo from "@/components/ToDo";
import Collapsible from "@/components/Collapsible";
import Collapsible2 from "@/components/Collapsible copy";
import DentistInfo from "@/components/DentistInfo";
import DentistAvailability from "@/components/DentistAvailability";

function ordinal_suffix_of(i: number) {
  let j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

export default function Home() {
  const { alignerProgress, alignerCount, updateUserContext, alignerChangeDate, user, oauthToken } = useUserContext();
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
        <Title>{user ? "Welcome back, " + user?.name : "Welcome back"}</Title>
        {alignerProgress > 0 && (
          <Text style={{ fontSize: 14 }} fontWeight="700" lightColor={Colors.light.tint} darkColor={Colors.light.tint}>
            {"You’re on your " + ordinal_suffix_of(alignerProgress) + " aligner of your treatment."}
          </Text>
        )}
        <Link style={[styles.progressHolder, styles.bottomMargin]} href="/progress">
          {/*  <Progress text="Progress Bar" currentAlignerCount={alignerProgress} totalAlignerCount={alignerCount} /> */}
        </Link>

        {alignerProgress > 0 && <Countdown style={styles.bottomMargin} timerPercentage={100} changeDate={new Date(Date.parse(alignerChangeDate))} />}

        <DentistInfo />
        <DentistAvailability />

        {changeDate < now ? (
          <Link href="/aligner-change-modal" asChild>
            <Button lightColor={Colors.light.tint} darkColor={Colors.dark.tint}>
              {alignerProgress > 0 ? "Time to change your aligners" : "Time to start your first aligners"}
            </Button>
          </Link>
        ) : (
          <Text />
        )}
      </View>
    </ScrollView>
  );
}

interface Content_LinkProps {}

const Content_Link: React.FC<Content_LinkProps> = () => {
  const image = require("@/assets/images/content.png");
  const [belowHeight, setBelowHeight] = useState(0);

  return (
    <View style={styles.content_link}>
      <Image style={[styles.image, { minHeight: belowHeight }]} source={image} contentFit="cover" contentPosition={{ top: "50%", right: "center" }} transition={1000} />
      <View style={styles.content_right} onLayout={(event) => setBelowHeight(event.nativeEvent.layout.height)}>
        <Text style={styles.contentHeading} lightColor="#fff" fontWeight="400">
          {`Share your smile with\nour social team to`}
        </Text>
        <Text style={[styles.contentHeading, { marginBottom: 19 }]} lightColor="#fff" fontWeight="800">
          {"earn vouchers"}
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
