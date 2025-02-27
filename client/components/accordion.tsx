import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming, SharedValue } from "react-native-reanimated";
import React from "react";
import { useThemeColor } from "./Themed";

import { View, Text } from "./Themed";

import { Pressable, StyleSheet, SafeAreaView, Button, ViewStyle } from "react-native";
import { useEffect } from "react";
import { Icon } from "./Icon";

import { useColorScheme } from "./useColorScheme";
import Colors from "@/constants/Colors";

interface Props {
  buttonText: String;
  hiddenText: string;
  style?: ViewStyle;
}

function AccordionItem({ isExpanded, children, viewKey, style, duration = 500 }) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View key={`accordionItem_${viewKey}`} style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}

function AccordionCross({ isExpanded, viewKey, style, duration = 500 }) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: 30, //derivedHeight.value,
  }));

  return (
    <Animated.View key={`accordionItem_${viewKey}`} style={[styles.animatedView, bodyStyle, style]}>
      <Text
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {"Cross here"}
      </Text>
    </Animated.View>
  );
}

type ItemProps = {
  children: string;
};

function Item({ children }: ItemProps) {
  return (
    <Text style={styles.hidden_text} fontWeight="400">
      {children}
    </Text>
  );
}

type ParentProps = {
  open: SharedValue<boolean>;
  children: string;
};

function Parent({ open, children }: ParentProps) {
  return (
    <View style={styles.parent}>
      <AccordionItem style={styles.none} isExpanded={open} viewKey="Accordion">
        <Item>{children}</Item>
      </AccordionItem>
    </View>
  );
}

const Accordion: React.FC<Props> = ({ buttonText, hiddenText, style }) => {
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  const text_color = useThemeColor({}, "text");

  const borderColor = useThemeColor({}, "text"); //(useColorScheme() ?? "light") ? Colors.light.text : Colors.dark.text;

  return (
    <SafeAreaView style={[styles.container, { borderBottomColor: borderColor }, style]}>
      <Pressable onPress={onPress}>
        <View style={styles.buttonTextHolder}>
          <Text style={styles.accordionText} fontWeight="600">
            {buttonText}
          </Text>
          <Icon width={"10"} height={"10"} color={useThemeColor({ light: "black", dark: "#fff" }, "text")} style={styles.cross} iconName="cross" />
        </View>
      </Pressable>
      <Parent open={open}>{hiddenText}</Parent>
    </SafeAreaView>
  );
};

//<AccordionCross style={styles.none} isExpanded={open} viewKey="Accordion" />

const styles = StyleSheet.create({
  none: {},
  container: {
    borderWidth: 1,
    borderColor: "#00000000",
    borderStyle: "solid",
    paddingVertical: 13,
    paddingLeft: 17,
    paddingRight: 45,
    width: "100%",
  },
  accordionText: {
    fontSize: 16,
    flex: 1,
  },
  hidden_text: {
    fontSize: 16,
    color: "#BDBDBD",
    width: "100%",
    paddingBottom: 15,
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  parent: {
    width: "100%",
    paddingLeft: 17,
  },
  wrapper: {
    width: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
  },
  animatedView: {
    width: "100%",
    overflow: "hidden",
  },
  box: {
    height: 120,
    width: 120,
    color: "#f8f9ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  cross: {
    //transform: [{ rotate: "45deg" }],
    flex: 1,
  },
  buttonTextHolder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7.5,
    padding: 10,
    width: "100%",
  },
});

export default Accordion;
