import React, { useState, useEffect } from "react";
import { Button, StyleSheet, LayoutChangeEvent, Alert, Pressable } from "react-native";

import { Text, View, TextInput } from "./Themed";

import * as Linking from "expo-linking";

import { Icon } from "./Icon";

type linkType = "web" | "mail" | "phone";

interface LogoLinkCardProps {
  text: string;
  iconName: string;
  link?: string;
  linkType?: linkType;
}

const handleClick = (link?: string, linkType?: linkType) => {
  if (link != null && linkType != null) {
    if (linkType == "web") {
      handleWeb(link);
    } else if (linkType == "mail") {
      handleEmail(link);
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

const handleApp = (link: string) => {
  //Go to the other screen
};

const LogoLinkCard: React.FC<LogoLinkCardProps> = ({ text, iconName, link, linkType }) => {
  return (
    <Pressable onPress={() => handleClick(link, linkType)}>
      <View style={styles.container}>
        <Icon iconName={iconName} color="white" />
        <Text style={styles.cardText} lightColor={"#5700FF"} darkColor="#000" fontWeight="600">
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5700FF",
    borderRadius: 10,
    minWidth: 110,
    minHeight: 110,
    aspectRatio: 1,

    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
    paddingTop: 28,
  },
  title: {},
  dateCardRow: {},
  cardText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 29,
  },
});

export default LogoLinkCard;
