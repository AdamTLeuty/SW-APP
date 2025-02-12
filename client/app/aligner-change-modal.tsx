import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useEffect } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Button, Text, TextInput, View, Title, Radio } from "@/components/Themed";
import { Link, router } from "expo-router";
import { Pressable } from "react-native";
//import { CheckBox } from "@rneui/themed";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { useUserContext } from "@/components/userContext";
import Toast from "react-native-toast-message";

interface DelayButtonProps {
  selectedIndex: number;
  delayReasons: string[];
}

const DelayButton: React.FC<DelayButtonProps> = ({ selectedIndex, delayReasons }) => {
  const { updateAlignerChangeDate } = useUserContext();

  const active = selectedIndex != -1;

  //{selectedIndex} {delayReasons[selectedIndex]}
  const delayAlignerChange = async () => {
    //This will call a function to delay the aligner change date by one, and send that information to the server
    //This will include the `Reason` string to log the issue
    try {
      await updateAlignerChangeDate(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Delayed aligner change until tomorrow",
      });
      router.replace("/(loggedIn)/home");
    } catch (e) {
      console.error("Failed to update aligner change date:" + e);
    }
  };

  if (active) {
    return (
      <Button lightColor={Colors.light.text} darkColor="#FFF" onPress={delayAlignerChange}>
        <Text lightColor="#FFF" darkColor={Colors.dark.background} fontWeight="600">
          {"Delay changing Aligners"}
        </Text>
      </Button>
    );
  } else {
    return (
      <Button lightColor="#F7F6F8" darkColor={Colors.dark.accentBackground}>
        <Text lightColor="#BDBDBD" darkColor="#BDBDBD" fontWeight="600">
          {"Delay changing Aligners"}
        </Text>
      </Button>
    );
  }
};

interface AlignerCountCheckProps {
  setGlobalAlignerCount: (count: number) => void;
}

const AlignerCountCheck: React.FC<AlignerCountCheckProps> = ({ setGlobalAlignerCount }) => {
  const [alignerCountInput, setAlignerCountInput] = useState<string>("");
  const [alignerCount, setAlignerCount] = useState<number>(0);

  useEffect(() => {
    const alignerCountInputClean = parseInt(alignerCountInput.replace(/[^0-9]/g, ""), 10);

    if (Number.isNaN(alignerCountInputClean)) {
      setAlignerCount(0);
    } else {
      setAlignerCount(alignerCountInputClean);
    }
  }, [alignerCountInput]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container]}>
        <Title>{"How many clear aligners\ndo you have?"}</Title>
        <Text style={{ textAlign: "center" }}> {"Before you put in your first aligner, we need to know how many aligners came in your treatment kit"} </Text>
        <Text> {"The input number is: " + alignerCount} </Text>
        <TextInput
          style={{ textAlign: "center", width: "100%" }}
          placeholder="Aligner Count"
          keyboardType="numeric"
          placeHolderTextColorLight={"#BDBDBD"}
          placeHolderTextColorDark={"#FFFFFF"}
          lightColor={"#4378ff"}
          darkColor={"#FFFFFF"}
          value={alignerCountInput}
          //If input is invalid, set as 0, else, keep as number
          onChangeText={setAlignerCountInput}
        />
        <Button
          onPress={() => {
            setGlobalAlignerCount(alignerCount);
          }}
        >
          Submit
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

interface DelayReasonListProps {
  selectedIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  delayReasons: string[];
}

const DelayReasonList: React.FC<DelayReasonListProps> = ({ selectedIndex, setIndex, delayReasons }) => {
  return (
    <View style={styles.list}>
      <Text fontWeight="400" style={styles.listHeading}>
        {"Tell us why you are delaying your clear aligner journey"}
      </Text>
      {delayReasons.map((reason, i) => (
        <View key={i}>
          <Radio
            style={{ backgroundColor: "transparent" }}
            checked={selectedIndex === i}
            onPress={() => {
              if (selectedIndex === i) {
                //Deselect the radio if clicked when active
                setIndex(-1);
              } else {
                //Select this checkbox
                setIndex(i);
              }
            }}
            checkedIcon="circle"
            uncheckedIcon="circle"
            checkedColor={Colors.tint}
            title={<Text style={styles.listItem}>{reason}</Text>}
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
  const { user, updateUserContext, alignerCount, updateAlignerCount, alignerProgress, updateAlignerProgress, alignerChangeDate, updateAlignerChangeDate } = useUserContext();
  const delayReasons = [
    "My aligners are still hurting my teeth",
    "I am waiting for a replacement aligner",
    "I can’t fit my new aligners in properly",
    "I don’t have access to my next set of aligners right now.",
    "Other",
  ];

  const changeAligner = async () => {
    //This needs to be an endpoint in Jarvis first
    //const response = await updateAlignerChangeDate(false);

    //Increment the aligner progress
    try {
      await updateAlignerProgress(alignerProgress + 1);
    } catch (e) {
      console.error("Failed to update aligner progress:" + e);
    }

    //Update the aligner change date to 10 days from now
    // This should be set by the user at setup
    try {
      await updateAlignerChangeDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString());
    } catch (e) {
      console.error("Failed to update aligner change date:" + e);
    }

    try {
      updateUserContext(user.email);
    } catch (e) {
      console.error("Failed to update user context" + e);
    }
    try {
      console.log("About to move to the camera screen");
      toCamera();
      console.log("Moved to the camera?");
    } catch (e) {
      console.error("Failed to move to the camera screen" + e);
    }

    return;
  };

  const toCamera = () => {
    router.replace("/(loggedIn)/camera");
  };
  if (alignerCount > 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title]} fontWeight="800" lightColor="black">
          {"It's time to change your\nclear aligners"}
        </Text>
        <Pressable onPress={changeAligner} style={styles.button}>
          <Text style={styles.buttonText} lightColor="#fff" fontWeight="600">
            {"Take new photo"}
          </Text>
        </Pressable>
        <DelayButton selectedIndex={selectedIndex} delayReasons={delayReasons} />
        <DelayReasonList setIndex={setIndex} selectedIndex={selectedIndex} delayReasons={delayReasons} />
      </View>
    );
  } else {
    return <AlignerCountCheck setGlobalAlignerCount={updateAlignerCount} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
    textAlign: "center",
    gap: 23,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    borderRadius: 47,
    backgroundColor: "#4378ff",
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
