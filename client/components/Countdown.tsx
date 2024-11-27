import React, { useState, useEffect } from "react";
import { View, Text } from "./Themed";
import { StyleSheet, LayoutChangeEvent } from "react-native";
import CircularProgress, { CircularProgressBase } from "react-native-circular-progress-indicator";
import Colors from "@/constants/Colors";
import { StyleProp, ViewStyle } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";

interface CountdownProps {
  timerPercentage: number;
  changeDate: Date;
  style: StyleProp<ViewStyle>;
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

function durationToSeconds(duration: string): number {
  // Split the input string into parts based on ":"
  const parts = duration.split(":").map(Number);

  // Validate the input format (it should have 4 parts: dd:hh:mm:ss)
  if (parts.length !== 4 || parts.some(isNaN)) {
    throw new Error("Invalid duration format. Expected format is dd:hh:mm:ss.");
  }

  const [days, hours, minutes, seconds] = parts;

  // Convert the duration to total seconds
  const totalSeconds =
    days * 24 * 60 * 60 + // Convert days to seconds
    hours * 60 * 60 + // Convert hours to seconds
    minutes * 60 + // Convert minutes to seconds
    seconds; // Add seconds

  return totalSeconds;
}

const Countdown: React.FC<CountdownProps> = ({ timerPercentage, changeDate, style }) => {
  const [radius, setRadius] = useState(0);
  const [time, setTime] = useState(new Date());
  const [ratio, setRatio] = useState(100);
  const ten_days = durationToSeconds("10:00:00:00");
  const inactiveStrokeOpacity = useColorScheme() == "light" ? 1 : 0.2;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      const time_left = durationToSeconds(getTimeUntil(changeDate, time));
      setRatio((time_left / ten_days) * 100);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setRadius(width / 2);
  };

  return (
    <View onLayout={handleLayout} style={[styles.container, style]}>
      {radius > 0 && (
        <CircularProgressBase
          radius={radius}
          value={ratio}
          activeStrokeWidth={21}
          inActiveStrokeWidth={21}
          initialValue={100}
          duration={5000}
          maxValue={100}
          activeStrokeColor={Colors.light.tint}
          inActiveStrokeColor={Colors.light.accentBackground}
          inActiveStrokeOpacity={inactiveStrokeOpacity}
        >
          <Text style={{ fontSize: 18 }} lightColor={"#3b3b3b"} darkColor={"#ffffff"} adjustsFontSizeToFit={true} numberOfLines={1} fontWeight="700">
            {"Countdown"}
          </Text>
          <Text style={styles.title} lightColor={Colors.light.tint} darkColor={Colors.dark.tint} adjustsFontSizeToFit={true} numberOfLines={1} fontWeight="800">
            {getTimeUntil(changeDate, time)}
          </Text>
          <Text style={{ fontSize: 14 }} lightColor={"#3b3b3b"} darkColor={"#fff"} adjustsFontSizeToFit={true} numberOfLines={1}>
            {"Until your next aligner"}
          </Text>
        </CircularProgressBase>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginHorizontal: 14 },
  title: {
    fontSize: 50,
    wordWrap: "nowrap",
    flexWrap: "nowrap",
    paddingHorizontal: 30,
    fontVariant: ["tabular-nums"],
    marginVertical: 4,
  },
  countdown: {
    width: "100%",
  },
});

export default Countdown;
