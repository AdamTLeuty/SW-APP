import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { Text, View, ScrollView, Title, Button } from "@/components/Themed";
import { Video, ResizeMode } from "expo-av";

import { Link } from "expo-router";

import Accordion from "@/components/accordion";

import { universalStyles } from "@/constants/Styles";

const VideoPlayer = () => {
  const videoUri = "https://cdn.shopify.com/videos/c/o/v/096c48f55f1849fdb131bc61dcf6d627.mp4";
  //const poster = require("@/assets/images/content.png");
  return (
    <Video
      source={{ uri: videoUri }}
      shouldPlay={true}
      //usePoster={true}
      //posterSource={poster}
      posterStyle={styles.poster}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
      style={styles.video}
    />
  );
};

export default function impressionsProcessPage() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Title style={universalStyles.bottomMargin} fontWeight="800">
          TAKING YOUR IMPRESSIONS
        </Title>
        <Text style={styles.body}>
          {
            "Before sending back your impression kit we request that you take a photo of your newly created impressions. This is to ensure that your aligners are to a high enough standard for our team to create your aligners."
          }
        </Text>
        <Link href="/(impressionProcess)/camera" asChild>
          <Button lightColor="#FF005C">{"Verify your impressions"}</Button>
        </Link>
        <Text fontWeight="600" style={styles.videoHeading}>
          {"PLEASE FOLLOW OUR GUIDE BELOW FOR THE BEST IMPRESSION RESULTS:"}
        </Text>
        <VideoPlayer />

        <Text style={styles.videoHeading} fontWeight="600" lightColor="#000">
          {"How to take your impressions"}
        </Text>

        <Accordion
          buttonText={"Step 1: Your impression kit"}
          hiddenText={
            "After your free e-consultation with one of our experts, we’ll send your at-home impression kit straight to your door. If you’re eligible, we’ll create your moulds, manufacture your aligners, and send them to you within 2-3 weeks of receiving your impressions. They’ll be posted straight to your door, and your smile journey can begin right away."
          }
        />

        <Accordion
          buttonText={"Step 2: Mixing and moulding your putty"}
          hiddenText={
            "Try each size of impression tray before mixing your putty. Your teeth shouldn’t touch the side of the tray. You have around 90 seconds to complete the next steps, so get your timer ready. Your putty will start to harden after this, so you’ll need to work quickly. \n\nTake 1 blue putty and 1 white putty from the fridge. Keep folding it until it’s soft and thoroughly mixed. If you see streaks, keep folding. This should take 30 seconds. Roll the blended putty between your hands to create a log that is about 10cm long (about the width of your hand). Do this within 30 seconds. Once the putty is rolled, lay it onto the impression tray, so that it fills the tray from end to end. Don’t apply pressure - just gently lay it in the tray. Do this within 30 seconds."
          }
        />

        <Accordion
          buttonText={"Step 3: Taking your impressions"}
          hiddenText={
            "Start with your bottom impressions. Use your index and middle fingers to evenly press the tray down over your top or bottom teeth, until your molars gently touch the bottom of the tray. Pull your lips over the impression tray and hold it in place for 4 minutes, until it hardens. Do not move the tray whilst it’s in your mouth. After 4 minutes, use the handle to gently remove the hardened impression in one fluid motion. There should be no dragging. Repeat the process until both your top and bottom impressions are complete. \n\nOnce done, send a photo of your impressions via WhatsApp to 07845461164. We’ll confirm if they’re suitable, helping to prevent any delays in the manufacturing of your aligners!"
          }
        />

        <Accordion
          buttonText={"Step 4: Returning your impressions"}
          hiddenText={
            "Fill out your contact details on the inside of the impression box. Place the completed impressions, still in their trays, into the clear bag provided.Put the bagged impressions back in the box and securely seal it with the sticker provided. Attach the included shipping label and drop off your box for free at any DPD drop point. Use the QR code to locate your nearest parcel shop."
          }
        />

        <View style={styles.separator} />
      </View>
    </ScrollView>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
