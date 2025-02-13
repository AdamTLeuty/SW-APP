import { Text, View } from "./Themed";

import React from "react";
import { StyleSheet } from "react-native";

import { LinearProgress } from "@rneui/themed";
import Colors from "@/constants/Colors";

interface Props {
  text: String;
  currentAlignerCount: number;
  totalAlignerCount: number;
}

export const Progress: React.FC<Props> = ({ text, currentAlignerCount, totalAlignerCount }) => {
  let progressValue: number;

  if (totalAlignerCount == 0) {
    progressValue = 0;
  } else if (currentAlignerCount < totalAlignerCount) {
    progressValue = currentAlignerCount / totalAlignerCount;
  } else {
    progressValue = 1;
  }

  progressValue = Math.min(Math.max(progressValue, 0), 1);
  progressValue = parseFloat(progressValue.toFixed(2));

  return (
    <View style={styles.container} lightColor="#f5f5f5" darkColor={Colors.dark.accentBackground}>
      <View style={styles.headingContainer}>
        <Text style={styles.progressBarHeaderText} lightColor="#3b3b3b" darkColor="#FFFFFF" fontWeight="700">
          {text}
        </Text>
        <View style={styles.alignerFraction}>
          <Text style={styles.fractionText} lightColor="#4378ff" darkColor="#4378ff" fontWeight="700">
            {currentAlignerCount}
          </Text>
          <Text style={styles.fractionText} lightColor="#3b3b3b" darkColor="#ffffff" fontWeight="700">
            {"/" + totalAlignerCount}
          </Text>
        </View>
      </View>
      <View style={styles.progressBarHolder} lightColor={"#FFFFFF"} darkColor={Colors.dark.background}>
        {false && <LinearProgress value={progressValue} variant="determinate" style={styles.progressBar} trackColor="#F7F6F8" color={"#FFBA00"} />}
        <View style={{ width: `${progressValue * 100}%`, height: 9, borderRadius: 10 }} lightColor={Colors.light.tint} darkColor={Colors.dark.tint} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingBottom: 22,
    paddingTop: 12,
    gap: 12,
  },
  headingContainer: {
    backgroundColor: "#f5f5f500",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBarHolder: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 10,
  },
  progressBar: {
    height: 9,
    borderRadius: 10,
  },
  progressBarHeaderText: {
    fontSize: 18,
  },
  alignerFraction: {
    backgroundColor: "#4378ff00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fractionText: {
    fontSize: 18,
  },
});

export default Progress;
