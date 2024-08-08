import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LogoTitle } from "./Logo";
import { Icon } from "./Icon";
import { useRouter } from "expo-router";

const CustomHeader = (props: { locked: boolean; backButton?: boolean; nav?: any }) => {
  const { locked, backButton, ...otherProps } = props;
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.buttonContainer}>
        {backButton ? (
          <TouchableOpacity activeOpacity={0.5} onPress={goBack}>
            <Icon iconName="back-arrow" />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        <LogoTitle style={styles.logo} {...props} locked={locked} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.5}>
          <Icon color="#BDBDBD" iconName="three-dots" />
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderColor: "red",
    borderWidth: 0,
    borderStyle: "solid",
    height: "100%",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    flex: 1,
    borderColor: "red",
    borderWidth: 0,
    borderStyle: "solid",
  },
  backButton: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderColor: "blue",
    borderWidth: 0,
    borderStyle: "solid",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CustomHeader;
