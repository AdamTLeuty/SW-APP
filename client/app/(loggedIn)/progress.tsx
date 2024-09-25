import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, ScrollView, Title } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import Calendar from "@/components/Calendar";
import { progressStyles as styles } from "@/constants/Styles";
import { universalStyles } from "@/constants/Styles";
import { Progress as ProgressBar } from "@/components/progress";

export default function Progress() {
  const { alignerProgress, alignerCount, updateUserContext, alignerChangeDate } = useUserContext();
  return (
    <ScrollView>
      <View style={styles.container}>
        <Title style={universalStyles.bottomMargin}>ALIGNER PROGRESS</Title>
        <Text style={[styles.content, universalStyles.bottomMargin]}>Keep up to date with your SCC aligner journey.</Text>
        <ProgressBar style={styles.progressHolder} text="Progress Bar" currentAlignerCount={alignerProgress} totalAlignerCount={alignerCount} />
        <Calendar title="Calendar" rows={3} />
      </View>
    </ScrollView>
  );
}
/*{" <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />" } */
