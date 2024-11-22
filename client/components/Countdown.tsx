import React, { useState, useEffect } from "react";
import { View, Text } from "./Themed";
import { StyleSheet, LayoutChangeEvent } from "react-native";
import CircularProgress, { CircularProgressBase } from "react-native-circular-progress-indicator";
import Colors from "@/constants/Colors";

interface CountdownProps {
  timerPercentage: number;
  changeDate: Date;
}

function getTimeUntil(targetDate: Date, now: Date): string {
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "00:00:00:00"; // Time's up
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const Countdown: React.FC<CountdownProps> = ({ timerPercentage, changeDate }) => {
  const [radius, setRadius] = useState(100);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setRadius(width / 2);
  };

  return (
    <View onLayout={handleLayout} style={styles.container}>
      {radius > 0 && (
        <CircularProgressBase radius={radius} value={timerPercentage} initialValue={100} duration={5000} activeStrokeColor={Colors.light.tint} inActiveStrokeOpacity={0.2}>
          <Text style={styles.title} lightColor={Colors.light.tint} darkColor={Colors.dark.tint} adjustsFontSizeToFit={true} numberOfLines={1}>
            {getTimeUntil(changeDate, time)}
          </Text>
          <Text style={{ fontSize: 20 }} lightColor={Colors.light.tint} darkColor={Colors.dark.tint} adjustsFontSizeToFit={true} numberOfLines={1} fontVariant={["tabular-nums"]}>
            {"Until your next aligner"}
          </Text>
        </CircularProgressBase>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  title: {
    fontSize: 50,
    wordWrap: "nowrap",
    flexWrap: "nowrap",
    paddingHorizontal: 20,
    fontVariant: ["tabular-nums"],
  },
  countdown: {
    width: "100%",
  },
});

export default Countdown;
