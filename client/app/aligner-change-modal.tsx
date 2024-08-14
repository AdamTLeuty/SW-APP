import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link, router } from "expo-router";
import { Pressable } from "react-native";
import { CheckBox } from "@rneui/themed";

import { useState } from "react";

interface DelayButtonProps {
  selectedIndex: number;
  delayReasons: string[];
}

const DelayButton: React.FC<DelayButtonProps> = ({ selectedIndex, delayReasons }) => {
  const active = selectedIndex != -1;

  //{selectedIndex} {delayReasons[selectedIndex]}
  const delayAlignerChange = () => {
    //This will call a function to delay the aligner change date by one, and send that information to the server
    //This will include the `Reason` string to log the issue
    //Then, send back to the home screen
    router.replace("/(loggedIn)/home");
  };

  if (active) {
    return (
      <Pressable style={[styles.button, styles.delayButtonActive]} onPress={delayAlignerChange}>
        <Text style={styles.buttonText} lightColor="#fff" fontWeight="600">
          {"Delay changing Aligners"}
        </Text>
      </Pressable>
    );
  } else {
    return (
      <View style={[styles.button, styles.delayButtonInactive]}>
        <Text style={[styles.buttonText, styles.delayButtonTextActive]} lightColor="#fff" fontWeight="600">
          {"Delay changing Aligners "}
        </Text>
      </View>
    );
  }
};

interface DelayReasonListProps {
  selectedIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  delayReasons: string[];
}

const DelayReasonList: React.FC<DelayReasonListProps> = ({ selectedIndex, setIndex, delayReasons }) => {
  //const [selectedIndex, setIndex] = useState(-1);
  //const { selectedIndex, setIndex} = props;

  return (
    <View style={styles.list}>
      <Text fontWeight="400" lightColor="black" style={styles.listHeading}>
        {"Tell us why you are delaying your Clear Aligner journey"}
      </Text>
      {delayReasons.map((reason, i) => (
        <View key={i}>
          <CheckBox
            checked={selectedIndex === i}
            onPress={() => setIndex(i)}
            checkedIcon="circle"
            uncheckedIcon="circle"
            checkedColor="#FF005C"
            title={
              <Text lightColor={"black"} style={styles.listItem}>
                {reason}
              </Text>
            }
            onIconPress={() => {
              if (selectedIndex === i) {
                //Deselect the radio if clicked when active
                setIndex(-1);
              } else {
                //Select this checkbox
                setIndex(i);
              }
            }}
            textStyle={styles.listItem}
          />
        </View>
      ))}
    </View>
  );
};

export default function ModalScreen() {
  const [selectedIndex, setIndex] = useState(-1);

  const delayReasons = [
    "My aligners are still hurting my teeth",
    "I am waiting for a replacement aligner",
    "I can’t fit my new aligners in properly",
    "I don’t have access to my next set of aligners right now.",
    "Other",
  ];

  const toCamera = () => {
    router.replace("/(loggedIn)/camera");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} fontWeight="800" lightColor="black">
        {"Time to change your\nClear Aligners"}
      </Text>
      <Pressable onPress={toCamera} style={styles.button}>
        <Text style={styles.buttonText} lightColor="#fff" fontWeight="600">
          {"Take new photo"}
        </Text>
      </Pressable>
      <DelayButton selectedIndex={selectedIndex} delayReasons={delayReasons} />
      <DelayReasonList setIndex={setIndex} selectedIndex={selectedIndex} delayReasons={delayReasons} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
    gap: 23,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    borderRadius: 47,
    backgroundColor: "#5700FF",
    paddingHorizontal: 39,
    paddingVertical: 10,
    textAlign: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 29,
  },
  delayButtonActive: {
    backgroundColor: "#FF005C",
  },
  delayButtonInactive: {
    backgroundColor: "#F7F6F8",
  },
  delayButtonTextActive: {
    color: "#BDBDBD",
  },
  list: {
    //maxWidth: "80%",
    marginHorizontal: 40,
  },
  reasonText: {},
  listHeading: {
    fontSize: 18,
    textAlign: "center",
  },
  listItem: {
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 14,
  },
});
