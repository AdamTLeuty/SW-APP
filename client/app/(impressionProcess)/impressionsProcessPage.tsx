import { Button, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { Text, View, ScrollView } from "@/components/Themed";
import { Video } from "expo-av";

import { Link } from "expo-router";

import Accordion from "@/components/accordion";

export default function impressionsProcessPage() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title} fontWeight="800">
          Impressions Process
        </Text>
        <Text style={styles.body}>
          {
            "Before sending back your impression kit we request that you take a photo of your newly created impressions. This is to ensure that your aligners are to a high enough standard for our team to create your aligners."
          }
        </Text>
        <Link href="/(impressionProcess)/camera" asChild>
          <Pressable style={styles.verifyButton}>
            <Text style={styles.verifyButtonText} lightColor="#fff" fontWeight="800">
              {"Verify your impressions"}
            </Text>
          </Pressable>
        </Link>
        <Text fontWeight="600" style={styles.videoHeading}>
          {"PLEASE FOLLOW OUR GUIDE BELOW FOR THE BEST IMPRESSION RESULTS."}
        </Text>
        <VideoPlayer />

        <Text style={styles.videoHeading} fontWeight="600" lightColor="#000">
          {"Impression Kit Steps!"}
        </Text>

        <Accordion
          buttonText={"Step One"}
          hiddenText={
            "After your free e-consultation with one of our experts, we’ll send your at-home impression kit straight to your door. Use our easy-to-follow video guide to provide your impressions. If you’re eligible, we’ll create your moulds, manufacture your aligners, and send them to you within 2-3 weeks of receiving your impressions. They’ll be posted straight to your door, and your smile journey can begin right away."
          }
        />

        <Accordion
          buttonText={"Step Two"}
          hiddenText={
            "After your free e-consultation with one of our experts, we’ll send your at-home impression kit straight to your door. Use our easy-to-follow video guide to provide your impressions. If you’re eligible, we’ll create your moulds, manufacture your aligners, and send them to you within 2-3 weeks of receiving your impressions. They’ll be posted straight to your door, and your smile journey can begin right away."
          }
        />

        <Accordion
          buttonText={"Step Three"}
          hiddenText={
            "After your free e-consultation with one of our experts, we’ll send your at-home impression kit straight to your door. Use our easy-to-follow video guide to provide your impressions. If you’re eligible, we’ll create your moulds, manufacture your aligners, and send them to you within 2-3 weeks of receiving your impressions. They’ll be posted straight to your door, and your smile journey can begin right away."
          }
        />

        <Accordion
          buttonText={"Step Four"}
          hiddenText={
            "After your free e-consultation with one of our experts, we’ll send your at-home impression kit straight to your door. Use our easy-to-follow video guide to provide your impressions. If you’re eligible, we’ll create your moulds, manufacture your aligners, and send them to you within 2-3 weeks of receiving your impressions. They’ll be posted straight to your door, and your smile journey can begin right away."
          }
        />

        <Accordion
          buttonText={"Step Five"}
          hiddenText={
            "After your free e-consultation with one of our experts, we’ll send your at-home impression kit straight to your door. Use our easy-to-follow video guide to provide your impressions. If you’re eligible, we’ll create your moulds, manufacture your aligners, and send them to you within 2-3 weeks of receiving your impressions. They’ll be posted straight to your door, and your smile journey can begin right away."
          }
        />
      </View>
    </ScrollView>
  );
}

const VideoPlayer = () => {
  const videoUri = require("@/assets/video/popeye_i_dont_scare_512kb.mp4");
  //const videoUri: string = "https://ia802701.us.archive.org/8/items/popeye_i_dont_scare/popeye_i_dont_scare_512kb.mp4"
  console.log("video???");
  const poster = require("@/assets/images/content.png");
  return <Video source={videoUri} shouldPlay={true} usePoster={true} posterSource={poster} posterStyle={styles.poster} useNativeControls resizeMode={"contain"} style={styles.video} />;
};

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
  poster: {
    flex: 1,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 22,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 22,
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
    marginVertical: 22,
  },
  content: {},
  verifyButton: {
    borderRadius: 47,
    backgroundColor: "#FF005C",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 44,
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
    borderRadius: 10,
    marginBottom: 22,
    borderWidth: 0,
  },
  videoHeading: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: "center",
    marginBottom: 22,
  },
});
