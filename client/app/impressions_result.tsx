import { Button, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { ScrollView, Text, View } from "@/components/Themed";
import { Video } from "expo-av";

import { Icon } from "@/components/Icon";
import { Link } from "expo-router";

import { SafeAreaView } from "react-native";
import { checkUserStatus } from "@/services/authService";
import { useUserContext } from "@/components/userContext";
import { getToken } from "@/services/tokenStorage";

type Result = "good" | "bad" | null;

export default function impressions_result() {
  const { user } = useUserContext();
  //const token = await getToken();
  //const userData = await checkUserStatus(user?.email, token);
  const [impressionConfirmation, setImpressionConfirmation] = useState<string | null>(null);
  const [token, setToken] = useState<String | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const userData = await checkUserStatus(user?.email, token);
        setToken(token);
        const userDataAsserted = userData?.userData as { impressionConfirmation: string };
        if (userDataAsserted.impressionConfirmation == "acceptable") {
          setImpressionConfirmation("good");
        }
        if (userDataAsserted.impressionConfirmation == "unacceptable") {
          setImpressionConfirmation("bad");
        }
        console.log("\n");
        console.log(userData);
        console.log(token);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const result: Result = "bad";

  if (impressionConfirmation == "good") {
    return (
      <ScrollView contentContainerStyle={{ alignItems: "center", backgroundColor: "red", justifyContent: "center", flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title} fontWeight="800">
            {"Wahoo!"}
          </Text>
          <Text style={styles.body} fontWeight="400">
            {"It’s time to send your impression kit back to the SCC lab."}
          </Text>
          <Icon style={styles.icon} width="210" height="210" iconName="thumbs_up" />
          <Link href="/home" asChild>
            <Pressable style={styles.homeButton}>
              <Text style={styles.impressionsButtonText} lightColor="#fff" fontWeight="800">
                {"Got it"}
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    );
  } else if (impressionConfirmation == "bad") {
    return (
      <ScrollView contentContainerStyle={{ alignItems: "center", backgroundColor: "red", justifyContent: "center", flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title} fontWeight="800">
            {"Let’s try that again."}
          </Text>
          <Text style={styles.body} fontWeight="400">
            {"It looks like you will have to retake your impressions on this occasion."}
          </Text>
          <Icon style={styles.icon} width="210" height="210" iconName="thumbs_down" color={"black"} />
          <Link href="/home" asChild>
            <Pressable style={styles.homeButton}>
              <Text style={styles.impressionsButtonText} lightColor="#fff" fontWeight="800">
                {"Contact Support"}
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView contentContainerStyle={{ alignItems: "center", backgroundColor: "red", justifyContent: "center", flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title} fontWeight="800">
            {"No news yet!"}
          </Text>
          <Text style={styles.body} fontWeight="400">
            {"It looks like we haven't checked your impressions yet, please check back again later."}
          </Text>
          <Link href="/home" asChild>
            <Pressable style={styles.homeButton}>
              <Text style={styles.impressionsButtonText} lightColor="#fff" fontWeight="800">
                {"Contact Support"}
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
    height: "100%",
    //borderColor: "red",
    //borderWidth: 5,
  },
  title: {
    fontSize: 25,
    lineHeight: 35,
    fontWeight: "bold",
    fontFamily: "Poppins_Bold",
    marginBottom: 29,
    marginHorizontal: 25,
  },
  body: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: "center",
    marginHorizontal: 25,
    marginBottom: 77,
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
  homeButton: {
    borderRadius: 47,
    backgroundColor: "#5700FF",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 22,
    textAlign: "center",
  },
  impressionsButtonText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 29,
  },
  icon: {
    marginBottom: 90,
  },
});
