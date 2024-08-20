import { Button, StyleSheet, Pressable, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";

import { Text, View } from "@/components/Themed";
import { Video } from "expo-av";

import { Icon } from "@/components/Icon";

type Result = "good" | "bad" | null;

export default function impressionsProcessPage() {
  const result: Result = "good";

  if (result == "good") {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text> {"test"} </Text>
          <Icon width="200" height="200" iconName="thumbs_up" color={"blue"} />
          <Icon width="200" height="200" iconName="thumbs_down" color={"red"} />
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text> {"test"} </Text>
          <Icon width="200" height="200" iconName="thumbs_up" color={"blue"} />
          <Icon width="200" height="200" iconName="thumbs_down" color={"green"} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    width: "100%",
    //borderColor: "red",
    //borderWidth: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins_Bold",
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  webview: {
    height: "100%",
    width: "100%",
    padding: "50%",
    borderRadius: 20,
    //borderColor: "red",
    //borderWidth: 2,
    //borderStyle: "solid",
  },
  supportCards: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  content: {},
  verifyButton: {
    borderRadius: 47,
    backgroundColor: "#FF005C",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginVertical: 36.5,
    textAlign: "center",
  },
  verifyButtonText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 29,
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
});
