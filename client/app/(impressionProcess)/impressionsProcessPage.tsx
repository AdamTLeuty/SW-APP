import { Button, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { Text, View } from "@/components/Themed";

import { Link } from "expo-router";

export default function impressionsProcessPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Impressions Process</Text>
      <Text style={styles.body}>
        {
          "Before sending back your impression kit we request that you take a photo of your newly created impressions. This is to ensure that your aligners are to a high enough standard for our team to create your aligners."
        }
      </Text>
      <Link href="/(impressionProcess)/camera" asChild>
        <Pressable style={styles.verifyButton}>
          <Text style={styles.verifyButtonText} lightColor="#fff" fontWeight="600">
            {"Verify your impressions"}
          </Text>
        </Pressable>
      </Link>
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
});
