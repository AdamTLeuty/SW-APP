import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, Stack } from "expo-router";
import { Image, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { LogoTitle } from "@/components/Logo";
import CustomHeader from "@/components/CustomHeader";
import { Icon } from "@/components/Icon";
import { View } from "@/components/Themed";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { iconName: string; width?: string; height?: string; color?: string; backgroundColor?: string; focused?: boolean }) {
  const otherStyles = {
    backgroundColor: props.backgroundColor,
    borderRadius: props.iconName == "photo" ? 100 : 10,
  };

  return (
    <View style={[styles.trayIcon, otherStyles]}>
      <Icon {...props} width="32" />
    </View>
  );
}

const styles = StyleSheet.create({
  trayIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    // borderCurve: 30,
    //borderColor: "red",
    //borderWidth: 1,
    //borderStyle: "solid",
    maxWidth: 50,
    maxHeight: 50,
    aspectRatio: 1 / 1,
    margin: 0,
    shadowColor: "rgba(153, 128, 172, 0.50)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBar: {
    //height: 120,
    height: "13%",
    minHeight: 90,
    //borderColor: "red",
    //borderWidth: 1,
    //borderStyle: "dashed",
    //backgroundColor: "green",
    display: "flex",
    gap: 0,
    paddingHorizontal: 15,
    backgroundColor: "#F7F6F8",
  },
  tabLabel: {
    margin: 0,
    //borderColor: "blue",
    //borderWidth: 1,
    //borderStyle: "dashed",
    //backgroundColor: "pink",
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const activeColor = Colors[colorScheme ?? "light"].tabIconSelected;
  const inactiveColor = Colors[colorScheme ?? "light"].tabIconDefault;

  return (
    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: styles.tabBar,

        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarBadgeStyle: styles.trayIcon,

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon iconName="home" width="30" color={focused ? inactiveColor : activeColor} backgroundColor={focused ? activeColor : inactiveColor} focused={focused} />
          ),
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} />;
          },
        }}
      />
      <Tabs.Screen
        name="impressionsProcessPage"
        options={{
          href: null,
          title: "impressionsProcessPage",

          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} backButton={true} nav={navigation} />;
          },
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          href: null,
          title: "Camera",
          headerShown: false, // This hides the header
        }}
      />
    </Stack>
  );
}
