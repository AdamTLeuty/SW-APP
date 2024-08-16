import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { Text, View } from "@/components/Themed";

export default function impressionsProcessPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impressions Process</Text>
      <Text style={styles.body}>
        {
          "Before sending back your impression kit we request that you take a photo of your newly created impressions. This is to ensure that your aligners are to a high enough standard for our team to create your aligners."
        }
      </Text>
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
});
