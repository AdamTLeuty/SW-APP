import { Text, View } from "./Themed";

import React from "react";
import { StyleSheet } from "react-native";

import { LinearProgress } from "@rneui/themed";

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

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.progressBarHeaderText} lightColor="#FFF" fontWeight="600">
          {text}
        </Text>
        <View style={styles.alignerFraction}>
          <Text style={styles.fractionText} lightColor="#FFBA00" fontWeight="600">
            {currentAlignerCount}
          </Text>
          <Text style={styles.fractionText} lightColor="#FFF" fontWeight="600">
            {"/" + totalAlignerCount}
          </Text>
        </View>
      </View>
      <View style={styles.progressBarHolder}>
        <LinearProgress value={progressValue} variant="determinate" style={styles.progressBar} trackColor="#F7F6F8" color={"#FFBA00"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#4378ff",
    paddingHorizontal: 17,
    paddingBottom: 22,
    paddingTop: 12,
    gap: 12,
  },
  headingContainer: {
    backgroundColor: "#4378ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBarHolder: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#4378ff",
  },
  progressBar: {
    height: 9,
    borderRadius: 10,
  },
  progressBarHeaderText: {
    fontSize: 18,
  },
  alignerFraction: {
    backgroundColor: "#4378ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fractionText: {
    fontSize: 18,
  },
});

export default Progress;
