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
          <Text
            style={styles.body}
          >{`Smile White Holding Ltd (company number 12014837) with its registered office at Westfield House, Lower Wortley Road, Leeds, England, LS12 4PX is the supplier of Smile White aligners.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Aligner Description"}
          </Title>
          <Text
            style={styles.body}
          >{`Smile White aligners consist of a series of clear plastic, removable appliances that move your teeth in small increments. Smile White aligners combines your dentist’s diagnosis and prescription with a Smile White orthodontist’s knowledge and recommendations to develop a treatment plan that speciﬁes the desired movements of your teeth during the course of your treatment. Upon approval of a treatment plan developed by your dentist, a series of customised Smile White aligners is produced speciﬁcally for your treatment and bespoke to you. Although orthodontic treatment can lead to a healthier and more attractive smile, you should also be aware that any orthodontic treatment (including orthodontic treatment with Invisalign aligners) has no guarantees as to outcome and there are limitations and potential risks that you should consider before undergoing treatment.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Procedure"}
          </Title>
          <Text
            style={styles.body}
          >{`You may undergo a routine orthodontic pre-treatment examination, including, scans, radiographs (x-rays) and photographs. Your dentist will take intra-oral scans of your teeth and send them, to Smile White. Smile White will use this information to create a treatment plan.
          Upon approval of the treatment plan by your dentist, Smile White will produce and ship a series of customised aligners to your dentist. The total number of aligners will vary depending on the complexity of your case. The aligners will be individually numbered and will be dispensed to you by your dentist with speciﬁc instructions for use. Unless otherwise instructed by your dentist, you should wear your aligners for approximately 22 hours per day, removing them only to eat, brush, and ﬂoss. As directed by your dentist, you will switch to the next aligner in the series every two weeks or as directed by your dentist. Some patients may require bonded aesthetic attachments and/or the use of elastics during treatment to facilitate speciﬁc orthodontic movements. Patients may require additional intra-oral scans and/or reﬁnement aligners after the initial series of aligners, each at additional cost to the patient.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Dentally Fit & Remedial Treatment"}
          </Title>
          <Text
            style={styles.body}
          >{`Being dentally ﬁt is deﬁned as having a healthy mouth (e.g. teeth, gums, and bone structure) that is free from any disease and does not require any dental treatment.
            \n\nUpon proceeding with your purchase, you agree and understand that Smile White is not responsible for any dental treatment required before aligners can be ﬁtted, and it is the patient’s responsibility to make all reasonable eﬀorts to ensure they are dentally ﬁt before their initial consultation appointment with a Smile White dentist.
            \n\nSmile White treatments are subject to a full dental assessment by a Smile White dentist. A Smile White dentist reserves the right to decline providing Smile White treatments to a patient who is deemed dentally ﬁt. The Smile White dentist may oﬀer remedial treatment options, privately, to help a patient become dentally ﬁt. The charges for any additional treatment options are solely decided by the Smile White dentist. Any remedial treatment required is arranged directly with the dentist. There is no requirement for any remedial treatment to be completed by the Smile White dentist and you can seek treatment at an alternative dentist of your choice.
            \n\nThe requirement of remedial treatment may delay the start of your Smile White treatments and could also require additional consultations with the Smile White dentist.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Late Cancellations & Failure to Attend"}
          </Title>
          <Text
            style={styles.body}
          >{`A late cancellation is deﬁned as cancelling a scheduled appointment with a Smile White dentist at such short notice as to cause disruption to the Smile White dentist.
            \n\nYour treatment covers a maximum of 3 dentist appointments. We may provide more at our sole discretion but are not obliged to. dentist appointsTA Failure to Attend appointment is when a patient does not attend their scheduled appointment with their Smile White dentist and does not inform the dental practice within a reasonable amount of time to not cause disruption to the Smile White dentist. There may be a cost to pay when rebooking an appointment if the patient has failed to attend their scheduled appointment with the Smile White dentist. Please refer to the Smile White dentist’s own policy regarding late cancellations, failure to attend and rebooking costs. In addition, Smile White charges £79 per appointment missed.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Allocated Smile White Dentist"}
          </Title>
          <Text
            style={styles.body}
          >{`While we strive to match every patient with a Smile White dentist in their preferred location (and within a 20-minute radius of their home address), we understand this may not always be possible. Patients will, therefore, be provided with the option of seeing a Smile White dentist in the next available area.
            \n\nSmile White is not responsible for the availability of Smile White dentists. The Smile White dentist will contact you to book your initial consultation, and any further appointments can be arranged directly with the Smile White dentist.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Use of photos/Videos"}
          </Title>
          <Text
            style={styles.body}
          >{`Smile White dentists may request to take clinical photographs and/or videos of a patient’s face and/or teeth for clinical, marketing, and educational purposes and they may share these with us. A patient’s name will never be published, and identity will never be disclosed without prior permission. If a patient DOES NOT give permission to Smile White and the Smile White dentist to use their images, please let us know by sending an email to hello@Smilewhite.co.uk.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Retainers"}
          </Title>
          <Text
            style={styles.body}
          >{`Retention is essential to ensure that your result is maintained. Retainers must be purchased separately from your purchase of aligners and are not included as part of the purchase (even where we provide them as a gesture of goodwill). To ensure your result is maintained after your aligner treatment, your retainer should be worn: ti - 12 months after treatment, worn every day except while eating. 12 - 24 months after treatment, worn every night. After 24 months after treatment, worn 3-4 nights every week. Teeth may shift position after treatment.
          Consistent wearing of retainers at the end of treatment should reduce this tendency.
          If the removable retainers are lost or broken, there is a further charge will be required.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Interproximal Reduction (IPR)"}
          </Title>
          <Text
            style={styles.body}
          >{`Interproximal reduction is the mechanical removal of some of the outer tooth surface, called enamel, between teeth. It is possible to reduce the width of certain teeth by up to ½ mm. The space created by
          Interproximal Reduction can then be used to straighten the teeth.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Cancellation fees & Refund Policy"}
          </Title>
          <Text
            style={styles.body}
          >{`Our clear aligners are bespoke manufactured goods for you. They are non-refundable (including if you choose to pay by finance) once your order has been placed. We encourage you to thoroughly consider your decision before scheduling an appointment.Cancellations fees applicable are as followed: Within 14 days of purchase, there is no cancellation fee. After 14 days of purchase and no treatment plan has been created a cancellation fee of £150 applies. After 14 days of purchase and a treatment plan has been created a cancellation fee of £300 applies. After manufacturing of aligners, any refund due will be at the sole discretion of Smile White.`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Refinements"}
          </Title>
          <Text style={styles.body}>{}</Text>

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
          <Text style={styles.body}>{`Like other orthodontic treatments, the use of Smile White aligners may involve some potential risks outlined below:
          \n· Failure to wear the aligners for the required number of hours per day, not using the product as directed by your dentist, missing appointments, and erupting or atypically shaped teeth can lengthen the treatment time and aﬀect the ability to achieve the desired results.
          \n· Dental tenderness may be experienced after switching to the next aligner in the series.
          \n· Tooth decay, periodontal disease, inﬂammation of the gums, or permanent markings (e.g., decalciﬁcation) may occur if patients consume foods or beverages containing sugar, do not brush and ﬂoss their teeth properly before wearing the Smile White products, or do not use proper oral hygiene and preventative maintenance.
          \n· At the end of orthodontic treatment, the bite may require adjustment (“occlusal adjustment”).
          \n· Aligners may temporarily affect speech and may result in a lisp.
          \n· Aligners may cause a temporary increase in salivation or mouth dryness and certain medications can heighten this effect.
          \n· Teeth may require interproximal recontouring or slenderising in order to create space needed for dental alignment to occur.
          \n· The bite may change throughout the course of treatment and may result in temporary patient discomfort.
          \n· A typically shaped, erupting, and/or missing teeth may aﬀect aligner adaptation and may aﬀect the ability to achieve the desired results.
          \n· Supplemental orthodontic treatment, including the use of bonded buttons, orthodontic elastics, auxiliary appliances/dental devices may be needed for more complicated treatment plans.
          \n· Teeth which have been overlapped for long periods of time may be missing the gingival tissue below the interproximal contact once the teeth are aligned, leading to the appearance of a “black triangle” space.
          \n· Aligners are not eﬀective in the movement of dental implants.
          \n· General medical conditions and use of medications can aﬀect orthodontic treatment.
          \n· Health of the bone and gums which support the teeth may be impaired or aggravated.
          \n· Existing dental treatment (e.g., crowns) may become dislodged and require re-cementation or, in some instances, replacement.
          \n· The length of the roots of the teeth may be shortened during orthodontic treatment and may become a threat to the useful life of teeth.
          \n· Orthodontic appliances or parts thereof may be accidentally swallowed or aspirated.
          \n· In rare instances, problems may also occur in the jaw joint, causing joint pain, headaches, or ear problems.
          \n· Teeth that are not at least partially covered by the aligner may undergo super-eruption.
          \n· Allergic reactions may occur`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Whitening"}
          </Title>
          <Text style={styles.body}>{`Smile White Pro Whitening may be used to treat a variety of cases, including:
          \n· Dietary stains
          \n· Yellow teeth due to aging
          \n· Tetracycline-stained teeth
          \n· Yellow/Brown teeth due to ﬂuorosis
          \n· Discoloured teeth due to calciﬁc metamorphosis
          Smile White Pro Whitening is not suitable for:
          \n· Patients under 18 years of age
          \n· Patients who are pregnant or breastfeeding
          \n· Patients who are not dentally ﬁt

          Smile White Whitening must be prescribed by a Smile White dentist.
`}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Smile White Aligner Conﬁrmation:"}
          </Title>
          <Text
            style={styles.body}
          >{`· I understand that the treatment plan shown to me and that actual clinical results may vary slightly and may need reﬁnement aligners at extra cost to me. In particular, I understand that Smile White Holdings Ltd, its representatives, employees, agents and other personnel have not and cannot make any guarantees or assurances concerning the outcome of my treatment and are under no obligation to provide refinement aligners or other goods/procedures to try and achieve my intended results.
          \n· I understand that I may need to have attachments on my teeth, and they have been explained to me.
          \n· I understand that I may have to have IPR (Interproximal Reduction), and this has been explained to me.
          \n· If I lose or break an aligner, there will be an additional cost (at whatever price we specify at that time) and treatment may be aﬀected.
          \n· I understand that I will need to wear a retainer at the end of treatment and will need to wear the retainer as per the above instructions (and that retainers are purchased separately).
          \n· I understand that side effects could occur as stated above.
          \n· There is no guarantee or assurance that a set of aligners will fit perfectly. If I do not wear the aligners as instructed, the possibility of this happening will increase significantly. Smile White is under no obligation to provide substitute or replacement aligners free of charge, although they may waive any requirement for payment at their absolute discretion. `}</Text>

          <Title style={styles.subtitle} fontWeight="700">
            {"Informed Consent:"}
          </Title>
          <Text
            style={[styles.body, { paddingBottom: 250 }]}
          >{`I have been provided ample time to read and have thoroughly reviewed the information detailing orthodontic treatments with Smile White. I accept the risks, alternatives, and inconveniences associated with both treatments, as well as the option of no treatment. I have received suﬃcient information and had the opportunity to ask questions and discuss concerns about the treatments with Smile White. I understand that I should only use Smile White products after consultation from a Smile White-approved dentist, and I hereby consent to treatment with Smile White products prescribed by Smile White’s chosen dentist.
          \nDue to the fact that orthodontics is not an exact science, I acknowledge that my dentist and Smile White have not and cannot make any guarantees or assurances concerning the outcome of my treatment. I understand that Smile White is not a direct provider of medical, dental or health care services and does not and cannot practice medicine, dentistry or give medical advice. No assurances or guarantees of any kind have been made to me by Smile White, its representatives, successors, assigns, and agents concerning any speciﬁc outcome of my treatment.
          \nI understand that Smile White will receive my medical records, including, but not be limited to, radiographs (x-rays), reports, charts, medical history, photographs, ﬁndings, plaster models, impressions of teeth, or intra-oral scans, prescriptions, diagnosis, medical testing, test results, billing, and other treatment records in my doctor’s possession (“Medical Records”) to the extent necessary for treatment, customer service, and billing. My Medical Records will only be shared with third parties. Smile White may also use this information for internal educational and internal data review and analysis purposes.
          \nI will not, nor shall anyone on my behalf, seek legal, equitable, or monetary damages or remedies for such disclosure. I acknowledge that the use of my Medical Records is without compensation, and I, nor shall anyone on my behalf, have any right of approval, claim of compensation, or seek or obtain legal, equitable, or monetary damages or remedies arising out of any use that complies with the terms of this Consent.
          \nA copy of this Consent shall be considered as eﬀective and valid as an original. I have read, understood, and agreed to the terms set forth in this
          Consent as indicated by my signature below.`}</Text>
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
