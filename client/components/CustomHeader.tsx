import React from "react";
import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LogoTitle } from "./Logo";
import { Icon } from "./Icon";
import { useRouter } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Pressable } from "react-native";
import { useUserContext } from "@/components/userContext";
import { View } from "./Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

const CustomHeader = (props: { locked: boolean; backButton?: boolean; nav?: any }) => {
  const { locked, backButton, ...otherProps } = props;
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  const { isLoggedIn, logout, nextStage } = useUserContext();
  //const routeTest = useRoute();

  const handleLogout = async () => {
    logout();
  };

  const onPress = () => {
    const options = isLoggedIn ? ["Settings", "Sign Out", "Cancel"] : ["Cancel"];
    const destructiveButtonIndex = isLoggedIn ? 1 : -1;
    const cancelButtonIndex = isLoggedIn ? 2 : 0;
    const cancelButtonTintColor = "#4378ff";
    const destructiveColor = "#FF005C";
    //const title = "Settings";

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        cancelButtonTintColor,
        destructiveColor,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case 0: //"Settings"
            if (isLoggedIn) {
              router.navigate("/settings");
            }
            break;
          case destructiveButtonIndex: //"Sign out"
            handleLogout();
            break;
          case cancelButtonIndex: //Cancel
            break;
          default: //Undefined - oops
            break;
        }
      },
    );
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.headerContainer} lightColor={Colors.light.background} darkColor={Colors.dark.background}>
      <View style={[styles.buttonContainer, { justifyContent: "flex-start" }]}>
        {backButton ? (
          <TouchableOpacity activeOpacity={0.5} onPress={goBack}>
            <Icon iconName="back-arrow" color="#4378ff" />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={[styles.buttonContainer, { flex: 2 }]}>
        <LogoTitle style={styles.logo} {...props} locked={locked} />
      </View>
      <View onTouchStart={onPress} style={[styles.buttonContainer, { justifyContent: "flex-end" }]}>
        <TouchableOpacity activeOpacity={0.5}>
          <Icon color={useColorScheme() == "light" ? "#bdbdbd" : Colors.dark.accentBackground + "ff"} iconName="three-dots" />
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
    padding: 20,
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
