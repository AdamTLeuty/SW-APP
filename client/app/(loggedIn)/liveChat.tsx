import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { WebView } from "react-native-webview";
import { Title, View } from "@/components/Themed";

export default function LiveChatScreen() {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Live Chat</Title>
      <WebView style={styles.webview} source={{ uri: "https://app-auth.smilewhite.co.uk/chat.php" }} />
    </View>
  );
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
});
