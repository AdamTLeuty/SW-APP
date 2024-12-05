import { View, ViewProps, Title, useThemeColor, Text } from "./Themed";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { Svg, Path, Rect, NumberProp } from "react-native-svg";
import { useSharedValue, withTiming, useDerivedValue, SharedValue } from "react-native-reanimated";
import { ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Pressable } from "react-native";

type CaretProps = {
  diameter?: NumberProp;
  color?: string;
  checked?: boolean;
};

type AccordionProps = {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
  viewKey: number;
  style?: ViewStyle;
  duration?: number;
};

const AccordionItem: React.FC<AccordionProps> = ({ isExpanded, children, viewKey, style, duration = 500 }) => {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value * (isExpanded.value ? 1 : 0), { duration }),
  }));

  return (
    <Animated.View key={`accordionItem_${viewKey}`} style={[{ width: "100%", overflow: "hidden" }, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={{ width: "100%", position: "absolute", paddingTop: 11 }}
      >
        {children}
      </View>
    </Animated.View>
  );
};

const Caret: React.FC<CaretProps> = ({ diameter, color, checked }) => {
  const size = diameter ? diameter : 10;

  return (
    <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
      <Rect x="0.5" y="0.5" width="26" height="26" rx="13" stroke={color} />
      <Path d="M10 12L13.8824 15.8182L17.7005 12.0002" stroke={color} />
    </Svg>
  );
};

type ParentProps = {
  open: SharedValue<boolean>;
  children: React.ReactNode;
};
function Parent({ open, children }) {
  return (
    <View style={{ width: "100%" }}>
      <AccordionItem isExpanded={open} viewKey={"Accordion"}>
        {children}
      </AccordionItem>
    </View>
  );
}

const Collapsible: React.FC<ViewProps> = ({ children, style, ...otherProps }) => {
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
    console.log("Just changed the value of open: " + open.value);
  };

  return (
    <View
      lightColor={Colors.light.accentBackground}
      darkColor={Colors.dark.accentBackground}
      style={[style, { width: "100%", justifyContent: "center", borderRadius: 20 }]}
      {...otherProps}
    >
      <Pressable onPress={onPress}>
        <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", width: "100%" }}>
          <Title style={{ textAlign: "left" }}>{"Practice details"}</Title>
          <Caret color={useThemeColor({ light: "#3b3b3b", dark: "#ffffff" }, "text")} diameter={27} />
        </View>
      </Pressable>
      <Parent open={open}>{children}</Parent>
    </View>
  );
};

export default Collapsible;
