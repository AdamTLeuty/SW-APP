import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LogoTitle } from "./Logo";

const CustomHeader = (props: { locked: boolean }) => {
  const { locked, ...otherProps } = props;
  return (
    <View style={styles.headerContainer}>
      <LogoTitle {...props} locked={locked} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    paddingTop: "20%",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CustomHeader;
