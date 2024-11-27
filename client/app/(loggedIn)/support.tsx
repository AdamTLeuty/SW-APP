import { Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, ScrollView } from "@/components/Themed";

import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";

import LogoLinkCard from "@/components/logoLinkCard";

import Accordion from "@/components/accordion";
import Colors from "@/constants/Colors";
import { universalStyles } from "@/constants/Styles";

//import { useRoute } from "@react-navigation/native";

export default function Support() {
  return (
    <ScrollView>
      <View style={[styles.container]}>
        <Text style={[styles.title, { marginBottom: 10 }]} fontWeight="800">
          Customer support
        </Text>
        <Text style={[universalStyles.bottomMargin, { fontSize: 14, textAlign: "center" }]} fontWeight="700" lightColor={Colors.light.tint} darkColor={Colors.light.tint}>
          We want to make sure that you have the best experience from start to finish.
        </Text>
        <View style={styles.supportCards}>
          <LogoLinkCard text="Call Us" iconName="phone" link="tel:${01138687615}" linkType="phone" />
          <LogoLinkCard text="Email Us" iconName="mail" link="mailto:hello@smilewhite.co.uk" linkType="mail" />
          <LogoLinkCard text="Live Chat" iconName="support" link="/liveChat" linkType="screen" />
        </View>

        <Text style={styles.faqTitle} fontWeight="600">
          Frequently asked questions
        </Text>

        <Accordion
          buttonText={"How often do I have to wear my clear aligners?"}
          hiddenText={"For the best results, your clear aligners need to be worn for 20-22 hours every day. Ideally, you should only remove them to eat, drink and brush your teeth."}
        />

        <Accordion
          buttonText={"Can I eat and drink as normal with my clear aligners in?"}
          hiddenText={
            "Always remove your clear aligners before eating and drinking, as they can be easily damaged or stained (even by soft drinks). You can only drink water with your clear aligners in."
          }
        />

        <Accordion
          buttonText={"After I eat, do I have to brush my teeth before putting my aligners back in?"}
          hiddenText={"It’s a good idea to brush your teeth before replacing your aligners, as food particles may make the inside of your aligners dirty, leading to bad odours."}
        />

        <Accordion
          buttonText={"Can I just wear my aligners at night?"}
          hiddenText={
            "If you only wear aligners at night, you won’t achieve the tooth movement necessary for a straighter smile. For the best results, your aligner should be worn for 20-22 hours per day."
          }
        />

        <Accordion
          buttonText={"How long do I have to wear my retainers after the aligners?"}
          hiddenText={
            "After you finish your aligner treatment, the bones under your teeth will still be regrowing. Without retainers, they may go back to their original position. We recommend wearing your retainers for at least six months."
          }
        />

        <Accordion
          buttonText={"How many trips to the dentist will I need throughout my treatment?"}
          hiddenText={"You’ll need three visits in total. Your dentist will ensure your comfort and oversee the creation of custom clear aligners designed to achieve your ideal smile."}
        />
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
    fontSize: 25,
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
  content: {
    paddingBottom: 22,
    textAlign: "center",
  },
});
