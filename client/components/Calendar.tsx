import React, { useState, useEffect } from "react";
import { Button, StyleSheet, LayoutChangeEvent } from "react-native";

import { Text, View, TextInput, useThemeColor } from "./Themed";
import Colors from "@/constants/Colors";

const layoutConstants = {
  cardMinWidth: 57,
  cardMinHeight: 86,
  minCardGap: 10,
  container_padding: 30, // Sum of horizontal padding values
};

interface CalendarProps {
  title: string;
  rows: number;
}

interface DateCardProps {
  i: number;
}

interface DateCardRowProps {
  rowNumber: number;
  cardNumber: number;
}

const getDate = (daysToAdd: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  const formattedDate = `${currentDate.getDate()}`;

  return formattedDate.toString().padStart(2, "0");
};

const getDayOfWeek = (daysToAdd: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return daysOfWeek[currentDate.getDay()];
};

const DateCard: React.FC<DateCardProps> = ({ i }) => {
  const [parentWidth, setParentWidth] = useState<number>(0);

  const handleCardLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setParentWidth(width);
  };

  let currentDate: boolean = false;

  if (getDate(i) === getDate(0)) {
    currentDate = true;
  }

  //currentCard: { backgroundColor: "#5700FF" },
  //otherCard: { backgroundColor: "#fff" },
  const backgroundColor = currentDate ? Colors["light"]["tint"] : useThemeColor({}, "accentBackground");

  return (
    <View style={styles.dateCard} lightColor={backgroundColor} darkColor={backgroundColor} onLayout={handleCardLayout}>
      <Text style={styles.dayOfWeek} lightColor={currentDate ? "#fff" : "#5700FF"} darkColor="#fff" fontWeight="500">
        {getDayOfWeek(i)}
      </Text>
      <Text style={styles.dateText} lightColor={currentDate ? "#fff" : "#5700FF"} darkColor="#fff" fontWeight="700">
        {getDate(i)}
      </Text>
    </View>
  );
};

const DateCardRow: React.FC<DateCardRowProps> = ({ rowNumber, cardNumber }) => {
  const startingValue = rowNumber * cardNumber;

  return (
    <View style={styles.dateCardRow}>
      {Array.from({ length: cardNumber }).map((_, i) => (
        //<Text key={i}>{i}</Text>
        <DateCard key={startingValue + i} i={startingValue + i} />
      ))}
    </View>
  );
};

const Calendar: React.FC<CalendarProps> = ({ rows, title }) => {
  const [parentWidth, setParentWidth] = useState<number>(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setParentWidth(width);
  };

  let availableParentWidth = parentWidth - layoutConstants.container_padding; //exclude the padding

  //Calculate maximum number of cards that can fit on one line;
  let maxCards = Math.floor((availableParentWidth + layoutConstants.minCardGap) / (layoutConstants.cardMinWidth + layoutConstants.minCardGap));

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Text style={styles.title} lightColor="#000" darkColor="#FFF" fontWeight="600">
        {title}
      </Text>
      {Array.from({ length: rows }).map((_, i) => (
        //<Text key={i}>{i}</Text>
        <DateCardRow rowNumber={i} cardNumber={maxCards} key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 25,
    //backgroundColor: "white",
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 1.0)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: "100%",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: layoutConstants.container_padding / 2,
    textAlign: "center",
    alignSelf: "center",
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
  },
  dateCardRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  dateCard: {
    width: layoutConstants.cardMinWidth,
    minHeight: layoutConstants.cardMinHeight,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 15,
    marginVertical: 10,
    shadowColor: "rgba(153, 128, 172, 0.50)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "flex-end",
    marginHorizontal: 0,
  },
  //currentCard: { backgroundColor: "#5700FF" },
  //otherCard: { backgroundColor: "#fff" },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
  },
  dateText: {
    fontSize: 26,
    fontWeight: 700,
    textAlign: "center",
  },
});

export default Calendar;
