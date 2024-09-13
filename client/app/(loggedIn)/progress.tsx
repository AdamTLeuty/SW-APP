import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, ScrollView } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import Calendar from "@/components/Calendar";
import { progressStyles as styles } from "@/constants/Styles";

export default function Progress() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title} fontWeight="800">
          Aligner Progress
        </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.content}>Keep up to date with your SCC aligner journey.</Text>
        <Calendar title="Calendar" rows={2} />
      </View>
    </ScrollView>
  );
}
