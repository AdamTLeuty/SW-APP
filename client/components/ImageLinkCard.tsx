import React, { useState, useEffect } from "react";
import { Button, StyleSheet, LayoutChangeEvent, Alert, Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";

import { Text, View, TextInput } from "./Themed";

import * as Linking from "expo-linking";

import { Icon } from "./Icon";
import Colors from "@/constants/Colors";

type linkType = "web" | "mail" | "phone" | "screen";

interface LogoLinkCardProps {
  text: string;
  iconName: string;
  link?: string;
  linkType?: linkType;
  source: string;
}

const handleClick = (link?: string, linkType?: linkType) => {
  if (link != null && linkType != null) {
    if (linkType == "web") {
      handleWeb(link);
    } else if (linkType == "mail") {
      handleEmail(link);
    } else if (linkType == "screen") {
      handleScreen(link);
    } else {
      handleCall(link);
    }
  }
};

const handleCall = (link: string) => {
  Linking.openURL(link).catch((err) => Alert.alert("Error", "Unable to open dialer"));
};

const handleEmail = (link: string) => {
  Linking.openURL(link).catch((err) => Alert.alert("Error", "Unable to open email client"));
};

const handleWeb = (link: string) => {
  Linking.openURL(link).catch((err) => Alert.alert("Error", "Unable to open web browser"));
};

const handleScreen = (link: string) => {
  router.push(link);
};

const ImageLinkCard: React.FC<LogoLinkCardProps> = ({ text, iconName, link, linkType, source }) => {
  return (
    <Pressable style={styles.container} onPress={() => handleClick(link, linkType)}>
      <Image source={source} style={{ width: "100%", aspectRatio: 0.86 }} contentPosition={"center"} />
      <View style={styles.label} lightColor={Colors.light.accentBackground} darkColor={Colors.dark.accentBackground}>
        <Text style={styles.cardText} lightColor={Colors.light.text} darkColor={Colors.dark.text} fontWeight="700">
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4378ff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    flex: 1,
    minWidth: "25%",
    aspectRatio: 1,
    margin: 0,
  },
  label: {
    position: "absolute",
    paddingTop: 8,
    width: "100%",
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
  },
  title: {},
  dateCardRow: {},
  cardText: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 22,
    minWidth: 10,
    width: 100,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
});

export default ImageLinkCard;
