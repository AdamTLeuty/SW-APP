import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useEffect } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Button, Text, TextInput, View, Title, Checkbox } from "@/components/Themed";
import { Link, router } from "expo-router";
import { Pressable } from "react-native";
//import { CheckBox } from "@rneui/themed";
import { updateAlignerChangeDate } from "@/services/authService";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { useUserContext } from "@/components/userContext";

interface DelayButtonProps {
  selectedIndex: number;
  delayReasons: string[];
}

const DelayButton: React.FC<DelayButtonProps> = ({ selectedIndex, delayReasons }) => {
  const active = selectedIndex != -1;

  //{selectedIndex} {delayReasons[selectedIndex]}
  const delayAlignerChange = async () => {
    //This will call a function to delay the aligner change date by one, and send that information to the server
    const response = await updateAlignerChangeDate(true);
    //This will include the `Reason` string to log the issue
    //Then, send back to the home screen
    router.replace("/(loggedIn)/home");
  };

  if (active) {
    return (
      <Button lightColor="#FF005C" darkColor="#FF005C" onPress={delayAlignerChange}>
        {"Delay changing aligners"}
      </Button>
    );
  } else {
    return (
      <Button lightColor="#F7F6F8" darkColor={Colors.dark.accentBackground}>
        <Text lightColor="#BDBDBD" darkColor="#BDBDBD" fontWeight="600">
          {"Delay changing Aligners "}
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
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Title>HOW MANY ALIGNERS DO YOU HAVE?</Title>
        <Text> {"Before you put in your first aligner, we need to know how many aligners came in your treatment kit"} </Text>
        <Text> {"The input number is: " + alignerCount} </Text>
        <TextInput
          style={{ textAlign: "center" }}
          placeholder="Aligner Count"
          keyboardType="numeric"
          placeHolderTextColorLight={"#BDBDBD"}
          placeHolderTextColorDark={"#FFFFFF"}
          lightColor={"#5700FF"}
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
          <Checkbox
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
            checkedColor="#FF005C"
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
  const { updateUserContext, alignerCount, updateAlignerCount } = useUserContext();

  const delayReasons = [
    "My aligners are still hurting my teeth",
    "I am waiting for a replacement aligner",
    "I can’t fit my new aligners in properly",
    "I don’t have access to my next set of aligners right now.",
    "Other",
  ];

  const updateAlignerProgress = async () => {
    const response = await updateAlignerChangeDate(false);
    updateUserContext();
    toCamera();
    return;
  };

  const toCamera = () => {
    router.replace("/(loggedIn)/camera");
  };
  if (alignerCount > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title} fontWeight="800" lightColor="black">
          {"It's time to change your\nclear aligners"}
        </Text>
        <Pressable onPress={updateAlignerProgress} style={styles.button}>
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
