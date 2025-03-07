import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Image, StyleSheet } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { LogoTitle } from "@/components/Logo";
import CustomHeader from "@/components/CustomHeader";
import { Icon } from "@/components/Icon";
import { useThemeColor, View } from "@/components/Themed";

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
    padding: 25,
    // borderCurve: 30,
    //borderColor: "red",
    //borderWidth: 1,
    //borderStyle: "solid",
    maxWidth: 50,
    maxHeight: 50,
    aspectRatio: 1 / 1,
    margin: 0,
    marginTop: 30,
    /*shadowColor: "rgba(153, 128, 172, 0.50)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,*/
    fontWeight: 700,
    color: "pink",
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
  },
  tabLabel: {
    margin: 0,
    marginTop: 30,
    fontWeight: 700,

    //borderColor: "blue",
    //borderWidth: 1,
    //borderStyle: "dashed",
    //backgroundColor: "pink",
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const activeTint = Colors[colorScheme ?? "light"].tabIconSelectedTint;
  const inactiveTint = Colors[colorScheme ?? "light"].text;
  const tabBarBackground = { backgroundColor: useThemeColor({}, "background") };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: activeTint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: [styles.tabBar, tabBarBackground],
        tabBarLabelStyle: [styles.tabLabel, { color: Colors[useColorScheme() ?? "light"].text }],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarBadgeStyle: styles.trayIcon,

          tabBarIcon: ({ color, focused }) => <TabBarIcon iconName="home" width="30" color={focused ? activeTint : inactiveTint} focused={focused} />,
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} />;
          },
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: "Photo",
          tabBarIcon: ({ color, focused }) => <TabBarIcon iconName="photo" width="30" color={focused ? activeTint : inactiveTint} focused={focused} />,
          headerShown: false, // This hides the header
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, focused }) => <TabBarIcon iconName="calendar" width="30" color={focused ? activeTint : inactiveTint} focused={focused} />,
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} />;
          },
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarIcon: ({ color, focused }) => <TabBarIcon iconName="support" width="30" color={focused ? activeTint : inactiveTint} focused={focused} />,
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} nav={navigation} />;
          },
        }}
      />

      <Tabs.Screen
        name="content"
        options={{
          title: "Content",
          href: null,
          //tabBarIcon: ({ color, focused }) => <TabBarIcon iconName="play" width="30" color={focused ? activeTint : inactiveTint} focused={focused} />,
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} />;
          },
        }}
      />

      <Tabs.Screen
        name="liveChat"
        options={{
          href: null,
          title: "Live Chat",
          lazy: false,
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} backButton={true} nav={navigation} />;
          },
        }}
      />

      <Tabs.Screen
        name="gallery"
        options={{
          href: null,
          title: "Gallery",

          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} backButton={true} nav={navigation} />;
          },
        }}
      />
    </Tabs>
  );
}
