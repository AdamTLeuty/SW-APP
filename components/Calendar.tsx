// components/UserInfo.tsx

import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View, TextInput } from "./Themed";
import { getUserByEmail, getUserLeadDetailsByEmail } from "../services/hubspotService";

interface CalendarProps {
  title: string;
  rows: number;
}

interface DateCardProps {
  i: number;
}

const DateCard: React.FC<DateCardProps> = ({ i }) => {
  return (
    <View style={styles.dateCard}>
      <Text style={styles.dayOfWeek} lightColor="#fff" darkColor="#000" fontWeight="500">
        {"Tu"}
      </Text>
      <Text style={styles.dateText} lightColor="#fff" darkColor="#000" fontWeight="700">
        {i}
      </Text>
    </View>
  );
};

const DateCardRow: React.FC<DateCardProps> = ({ i }) => {
  return (
    <View style={styles.dateCardRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        //<Text key={i}>{i}</Text>
        <DateCard i={i} />
      ))}
    </View>
  );
};

const Calendar: React.FC<CalendarProps> = ({ rows, title }) => {
  const fetchDate = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title} lightColor="#000" darkColor="#FFF" fontWeight="600">
        {title}
      </Text>
      {Array.from({ length: rows }).map((_, i) => (
        //<Text key={i}>{i}</Text>
        <DateCardRow i={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 25,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "rgba(0, 0, 0, 1.0)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    //width: "100%",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
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
    justifyContent: "flex-start",
    gap: 20,
    flexDirection: "row",
    width: "100%",
  },
  dateCard: {
    backgroundColor: "#5700FF",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    marginVertical: 10,
    width: "auto",
    shadowColor: "rgba(153, 128, 172, 0.50)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "flex-end",
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
  },
  dateText: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
  },
});

export default Calendar;
