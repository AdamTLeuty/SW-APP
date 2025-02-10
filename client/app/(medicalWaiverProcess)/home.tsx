import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { useRef } from "react";

import { Link } from "expo-router";

import EditScreenInfo from "@/components/EditScreenInfo";
import LoginArea from "@/components/LoginArea";
import { Text, View, ScrollView, Title, Button, Checkbox, SafeAreaView, LinearGradient, useThemeColor } from "@/components/Themed";
import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { getToken } from "@/services/tokenStorage";
import { Icon } from "@/components/Icon";
import Calendar from "@/components/Calendar";
import Progress from "@/components/progress";
import { RefreshControl } from "react-native";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";

import { Status } from "@/components/userContext";
import { universalStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { BlurView } from "@/components/Themed";
import { signMedicalWaiver } from "@/services/authService";

import { jwtDecode } from "jwt-decode";

const handleClick = async (setWaiting: React.Dispatch<React.SetStateAction<Boolean>>, updateUserContext: (email: string) => Promise<void>, userEmail: string, oauthTokens: any) => {
  setWaiting(true);
  try {
    const userEmail = jwtDecode(oauthTokens.idToken).email;
    console.log("User email:", userEmail);
    console.log(oauthTokens.idToken);
    const response = await signMedicalWaiver(userEmail, oauthTokens.idToken);
    if (response) {
      console.log("Medical waiver signed successfully.");
      updateUserContext(userEmail);
      setWaiting(false);
    } else {
      console.error("Failed to sign medical waiver.");
      setWaiting(false);
    }
  } catch (error) {
    setWaiting(false);
    console.error("An error occurred:", error);
  }
};

interface TermsButtonProps {
  boxChecked: boolean;
  updateUserContext: (email: string) => Promise<void>;
  userEmail: string;
  oauthTokens: any;
}

const TermsButton: React.FC<TermsButtonProps> = ({ boxChecked, updateUserContext, userEmail, oauthTokens }) => {
  const [waiting, setWaiting] = useState<Boolean>(false);

  if (boxChecked) {
    return (
      <Button
        onPressIn={() => {
          handleClick(setWaiting, updateUserContext, userEmail, oauthTokens);
        }}
        waiting={waiting}
      >
        <Text lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
          {"Accept terms and conditions"}
        </Text>
      </Button>
    );
  } else {
    return (
      <Button lightColor={Colors.light.accentBackground} darkColor={Colors.dark.accentBackground}>
        <Text lightColor={Colors.dark.text} darkColor={Colors.light.text}>
          {"Accept terms and conditions"}
        </Text>
      </Button>
    );
  }
};

export default function Home() {
  const { updateUserContext, user, oauthTokens } = useUserContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isChecked, setChecked] = useState(false);
  const [confirmationBoxHeight, setConfirmationBoxHeight] = useState(0);

  return (
    <SafeAreaView lightColor={Colors.light.background} darkColor={Colors.dark.background} style={{ width: "100%", flex: 1 }}>
      <View lightColor={Colors.light.background} darkColor={Colors.dark.background} style={[styles.container]}>
        <ScrollView style={{ width: "100%", height: "100%" }}>
          <Title style={universalStyles.bottomMargin}>Medical waiver</Title>
          <Text style={styles.body}>Your medical waiver needs to be signed before you can continue.</Text>
          <Title style={styles.subtitle} fontWeight="700">
            {"Supplier Information"}
          </Title>
          <Text style={styles.body}>{`Smile White Holding Ltd (company number 12014837)\n\nRegistered Office: Westfield House, Lower Wortley Road, Leeds, England, LS12 4PX`}</Text>
          <Title style={styles.subtitle} fontWeight="700">
            {"Aligner Description"}
          </Title>
          <Text
            style={styles.body}
          >{`Smile White aligners consist of a series of clear plastic, removable appliances that move your teeth in small increments. The treatment combines your dentist’s diagnosis and prescription with a Smile White orthodontist’s knowledge to develop a treatment plan. Upon approval of the plan by your dentist, a series of customized aligners is produced specifically for you. \n\nWhile orthodontic treatment can improve your smile, it comes with no guarantees as to outcome. Be aware of the potential risks and limitations before proceeding with treatment.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Procedure"}
          </Title>
          <Text
            style={styles.body}
          >{`You may undergo a pre-treatment examination, including scans, radiographs (x-rays), and photographs. Your dentist will take intra-oral scans of your teeth and send them to Smile White to create a treatment plan. Upon approval, a series of customized aligners will be produced and shipped to your dentist.\n\nUnless otherwise instructed, wear your aligners for approximately 22 hours per day, removing them only to eat, brush, and floss. Follow your dentist's instructions for switching to the next aligner in the series.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Dentally Fit & Remedial Treatment"}
          </Title>
          <Text
            style={styles.body}
          >{`Being dentally fit means having a healthy mouth that is free from disease and requires no treatment.\n\nSmile White is not responsible for any dental treatment needed before aligners can be fitted. It is your responsibility to ensure you are dentally fit before your initial consultation.\n\nSmile White treatments are subject to a full dental assessment. If you are not dentally fit, treatment may be declined. Remedial treatment may be offered at an additional cost, but you are not required to undergo treatment with Smile White dentists.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Late Cancellations & Failure to Attend"}
          </Title>
          <Text
            style={styles.body}
          >{`A late cancellation is defined as cancelling an appointment with insufficient notice, causing disruption. Your treatment covers a maximum of 3 appointments. Additional appointments may be provided at Smile White’s discretion.\n\nFailure to attend an appointment without prior notice may result in a rebooking fee, subject to the Smile White dentist’s policy. Additionally, Smile White may charge £79 per missed appointment.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Allocated Smile White Dentist"}
          </Title>
          <Text
            style={styles.body}
          >{`While we aim to match patients with a Smile White dentist in their preferred location, this may not always be possible. If needed, an alternative location may be provided.\n\nSmile White is not responsible for the availability of dentists. Further appointments should be arranged directly with your allocated dentist.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Gifts Provided by Smile White"}
          </Title>
          <Text
            style={styles.body}
          >{`Smile White may offer gifts as part of the aligner package, such as whitening. These gifts are at Smile White’s discretion and are not a guaranteed part of the purchase.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Use of Photos/Videos"}
          </Title>
          <Text
            style={styles.body}
          >{`Smile White dentists may request to take clinical photographs and/or videos for clinical, marketing, or educational purposes. If you do not give permission for this, please email hello@Smilewhite.co.uk.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Refinements"}
          </Title>
          <Text
            style={styles.body}
          >{`Aligners are manufactured based on the approved treatment plan. Once the treatment is complete, Smile White’s obligation is complete. Any further refinements would be considered a separate treatment at additional cost.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Retainers"}
          </Title>
          <Text
            style={styles.body}
          >{`Retention is essential to maintaining your treatment results. Retainers must be purchased separately and worn according to the following schedule:\n\n- 6-12 months: Worn every day except while eating.\n- 12-24 months: Worn every night.\n- After 24 months: Worn 3-4 nights per week.\n- If retainers are lost or broken, a replacement charge will apply.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Interproximal Reduction (IPR)"}
          </Title>
          <Text
            style={styles.body}
          >{`IPR involves the mechanical removal of enamel between teeth to create space for alignment. Up to ½ mm of enamel may be removed. This space helps to straighten the teeth.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Cancellation Fees & Refund Policy"}
          </Title>
          <Text
            style={styles.body}
          >{`You have 7 calendar days from the date you accept these terms to change your mind. After this period, the order is non-refundable, even if you pay by finance.\n\nPlease consider your decision carefully before proceeding.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Key Information"}
          </Title>
          <Text
            style={styles.body}
          >{`Potential risks associated with Smile White aligners include:\n\n- Failure to wear aligners as directed can lengthen treatment time and affect results.\n- Dental tenderness may occur after switching aligners.\n- Poor oral hygiene can lead to tooth decay, gum disease, and permanent markings.\n- Adjustments to your bite may be needed at the end of treatment.\n- Aligners may temporarily affect speech and cause increased salivation or dryness.\n- Teeth may shift position after treatment if retainers are not worn consistently.\n- Additional risks include allergic reactions, jaw pain, and root shortening.`}</Text>
          <Title style={styles.subtitle} fontWeight="700">
            {"Whitening"}
          </Title>
          <Text
            style={styles.body}
          >{`Smile White Pro Whitening treats various dental discolorations but is not suitable for patients under 18, pregnant or breastfeeding women, or those who are not dentally fit.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Aligner Confirmation"}
          </Title>
          <Text
            style={[styles.body, { marginBottom: confirmationBoxHeight }]}
          >{`- I understand that actual clinical results may vary and that refinement aligners may incur extra costs.\n- I may need attachments or IPR, and I accept the associated costs and treatment implications.\n- Lost or broken aligners will incur additional costs.\n- I must wear a retainer after treatment to maintain results.\n- I accept the possible side effects and limitations of aligner treatment.I understand that no guarantees are made regarding the fit of aligners.`}</Text>
        </ScrollView>
      </View>
      <LinearGradient
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setConfirmationBoxHeight(height);
        }}
        colors={[useThemeColor({}, "background") + "00", useThemeColor({}, "background")]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.2 }}
        style={[styles.container, { position: "absolute", bottom: 0, width: "100%", paddingTop: 75 }]}
      >
        <Title style={styles.subtitle} fontWeight="700">
          {"Agreement to Terms and Conditions"}
        </Title>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 22, maxWidth: "100%" }}>
          <Checkbox isChecked={isChecked} setChecked={setChecked} style={{ padding: 10 }} />
          <Text
            style={styles.body}
          >{`I have reviewed and understood the terms and conditions for Smile White treatment. I accept the risks and agree to proceed with the treatment, acknowledging that Smile White makes no guarantees regarding the outcome.`}</Text>
        </View>
        <TermsButton boxChecked={isChecked} updateUserContext={updateUserContext} userEmail={user?.email} oauthTokens={oauthTokens} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ScrollViewStyle: {
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 22,
  },
  separator: {
    marginVertical: 22,
    height: 1,
    width: "80%",
  },
  impressionsButton: {
    borderRadius: 47,
    backgroundColor: "#FF005C",
    paddingHorizontal: 39,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 22,
    textAlign: "center",
  },
  homeButton: {
    borderRadius: 47,
    backgroundColor: "#4378ff",
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
  subheading: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: "center",
    marginBottom: 22,
  },
  body: { fontSize: 14, lineHeight: 21, textAlign: "left", width: "100%", marginBottom: 20, marginTop: 10, flexWrap: "wrap", flex: 1 },
  subtitle: {
    fontSize: 20,
    textAlign: "left",
    width: "100%",
  },
});
