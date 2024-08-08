import React, { useState, useEffect } from "react";
import { Button, StyleSheet, LayoutChangeEvent, Alert, Pressable } from "react-native";
import { router } from "expo-router";

import { Text, View, TextInput } from "./Themed";

import * as Linking from "expo-linking";

import { Icon } from "./Icon";

type linkType = "web" | "mail" | "phone" | "screen";

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

const LogoLinkCard: React.FC<LogoLinkCardProps> = ({ text, iconName, link, linkType }) => {
  return (
    <Pressable style={styles.container} onPress={() => handleClick(link, linkType)}>
      <Icon iconName={iconName} color="white" />
      <Text style={styles.cardText} lightColor={"#5700FF"} darkColor="#000" fontWeight="600">
        {text}
      </Text>
    </Pressable>
  );
};
/*
<Pressable  onPress={() => handleClick(link, linkType)}>
  <View style={styles.container}>
    <Icon iconName={iconName} color="white" />
    <Text style={styles.cardText} lightColor={"#5700FF"} darkColor="#000" fontWeight="600">
      {text}
    </Text>
  </View>
</Pressable>
*/
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5700FF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",

    paddingBottom: 6,
    paddingTop: 25,
    paddingHorizontal: 3,

    flex: 1,

    minWidth: "25%",

    aspectRatio: 1,
    //flexBasis: 0,
    //flexShrink: 1,
    //flexGrow: 1,
    //flex: 1,
    //maxWidth: 110,
    //maxHeight: 110,
    //maxWidth: 110,
    //aspectRatio: 1,
    //height: "auto",
    //alignSelf: "flex-start",
    //width: "25%",

    margin: 0,
  },
  title: {},
  dateCardRow: {},
  cardText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 29,
    minWidth: 10,
    width: 100,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
});

export default LogoLinkCard;
