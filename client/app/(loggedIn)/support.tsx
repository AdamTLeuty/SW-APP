import { Button, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, ScrollView } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";

import LogoLinkCard from "@/components/logoLinkCard";

import Accordion from "@/components/accordion";

//import { useRoute } from "@react-navigation/native";

export default function Support() {
  const { isLoggedIn, logout } = useUserContext();
  //const routeTest = useRoute();

  useEffect(() => {
    //console.log("Current route:", routeTest.name);
    if (!isLoggedIn) {
      //console.log("Before the routing change");
      console.log("The token is: " + getToken());
      router.replace("/(tabs)");
      //console.log("After the routing change");
    }
  }, [isLoggedIn]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title} fontWeight="700">
          Customer Support
        </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.content}>We want to make sure that you have the best experience from start to finish.</Text>
        <View style={styles.supportCards}>
          <LogoLinkCard text="Call Us" iconName="phone" link="tel:${03308226507}" linkType="phone" />
          <LogoLinkCard text="Email Us" iconName="mail" link="mailto:info@smilecorrectclub.co.uk" linkType="mail" />
          <LogoLinkCard text="Live Chat" iconName="support" link="/liveChat" linkType="screen" />
        </View>

        <Text style={styles.faqTitle} fontWeight="600">
          Frequently asked questions
        </Text>

        <Accordion
          buttonText={"How does Smile Correct Club work?"}
          hiddenText={
            "After your free e-consultation with one of our experts, we’ll send your at-home impression kit straight to your door. Use our easy-to-follow video guide to provide your impressions. If you’re eligible, we’ll create your moulds, manufacture your aligners, and send them to you within 2-3 weeks of receiving your impressions. They’ll be posted straight to your door, and your smile journey can begin right away."
          }
        />

        <Accordion
          buttonText={"How much do clear aligners cost?"}
          hiddenText={"Our single-arch aligners are £1,295 or £26.96 per month. Our dual-arch clear aligners are £1,595 or £33.21 per month."}
        />

        <Accordion
          buttonText={"How long do I have to wear clear aligners?"}
          hiddenText={"For the best results, your clear aligners need to be worn for 20-22 hours every day. Ideally, you should only remove them to eat, drink and brush your teeth."}
        />

        <Accordion
          buttonText={"How long will the treatment take?"}
          hiddenText={
            "Our average aligner treatment plan is between 4-7 months. Some treatment plans may be shorter and some may be longer - it’s completely dependent on the complexity of your case."
          }
        />

        <Accordion buttonText={"Are you Smile Direct Club?"} hiddenText={"No! We are Smile Correct Club, and are not affiliated with Smile Direct Club in any way."} />
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
  },
  title: {
    fontSize: 20,
  },
  faqTitle: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  supportCards: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
    flexWrap: "wrap",
    maxWidth: "100%",
    rowGap: 10,
    columnGap: 10,
    //flex: 1,
  },
  content: {},
});
