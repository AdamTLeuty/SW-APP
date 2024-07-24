import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Image } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { LogoTitle } from "@/components/Logo";
import CustomHeader from "@/components/CustomHeader";
import { TrayIcon } from "@/components/Icon";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TrayIcon iconName="home" width="30" color={color} />,
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} />;
          },
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Customer Support",
          tabBarIcon: ({ color }) => <TrayIcon iconName="support" width="30" color={color} />,
          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={false} />;
          },
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Photo",
          tabBarIcon: ({ color }) => <TrayIcon iconName="photo" width="30" color={color} />,
          headerShown: false, // This hides the header
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <TrayIcon iconName="calendar" width="30" color={color} />,
          headerShown: false, // This hides the header
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: "Content",
          tabBarIcon: ({ color }) => <TrayIcon iconName="play" width="30" color={color} />,
          headerShown: false, // This hides the header
        }}
      />
    </Tabs>
  );
}
/*

*/
