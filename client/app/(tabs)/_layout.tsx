import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Image } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import CustomHeader from "@/components/CustomHeader";

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
        name="index"
        options={{
          href: null,
          title: "Log In",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,

          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={true} nav={navigation} />;
          },
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null,
          title: "Register",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,

          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={true} backButton={true} nav={navigation} />;
          },
        }}
      />
      <Tabs.Screen
        name="verify"
        options={{
          href: null,
          title: "Verify",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,

          header: ({ navigation, route, options }) => {
            return <CustomHeader locked={true} backButton={true} nav={navigation} />;
          },
        }}
      />
    </Tabs>
  );
}
