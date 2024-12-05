import { View, ViewProps, Text, Title, useThemeColor } from "./Themed";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Svg, Rect, Path } from "react-native-svg";
import * as Linking from "expo-linking";
import { NumberProp } from "react-native-svg";
import { Pressable } from "react-native";
type RadioProps = {
  diameter?: NumberProp;
  color?: string;
  checked?: boolean;
};

const Radio: React.FC<RadioProps> = ({ diameter, color, checked }) => {
  const size = diameter ? diameter : 10;

  if (checked) {
    return (
      <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
        <Rect width="27" height="27" rx="13.5" fill={Colors.tint} stroke="#ffffff00" />
        <Path d="M8 13.1818L11.8824 17L19 10" stroke="white" />
      </Svg>
    );
  } else {
    return (
      <Svg width={size} height={size} viewBox="0 0 27 27" fill="none" style={{ aspectRatio: 1 / 1 }}>
        <Rect x="0.5" y="0.5" width="26" height="26" rx="13" stroke={color} />
      </Svg>
    );
  }
};

type ToDoProps = ViewProps & {
  checked?: boolean;
  title?: string;
  subtitle?: string;
  link?: string;
};

const ToDo: React.FC<ToDoProps> = ({ children, style, checked, title, subtitle, link, ...otherProps }) => {
  const [linkPressed, setLinkPressed] = useState<boolean>(false);

  if (checked) {
    return (
      <View style={[style, { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }]} {...otherProps}>
        <Title style={{ textAlign: "left" }}>{"To do list"}</Title>
        <Radio diameter={27} color={useThemeColor({}, "text")} checked={checked} />
      </View>
    );
  } else {
    return (
      <View>
        <Title style={{ textAlign: "left", marginBottom: 11 }}>{"To do list"}</Title>
        <View style={[style, { display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }]} {...otherProps}>
          <Radio diameter={27} color={useThemeColor({}, "text")} checked={checked} />
          <View style={{ justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, lineHeight: 14 }} fontWeight="800">
              {title}
            </Text>
            <Pressable
              onPressIn={() => setLinkPressed(true)}
              onPressOut={() => setLinkPressed(false)}
              onPress={() => link && Linking.openURL(link).catch(() => console.error("Error", "Unable to open web browser"))}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 17,
                  textDecorationLine: link ? "underline" : "none",
                }}
                fontWeight="400"
                lightColor={linkPressed ? "#f5f5f5" : Colors.light.text}
                darkColor={linkPressed ? "#ffffff14" : Colors.dark.text}
              >
                {subtitle}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
};

export default ToDo;
