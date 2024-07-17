/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const defaultStyle = {
    color,
    fontFamily: "Poppins",
    // Add other default styles here
  };

  return <DefaultText style={[defaultStyle, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const defaultStyle = {
    backgroundColor,
    fontFamily: "Poppins",
    // Add other default styles here
  };

  return <DefaultView style={[defaultStyle, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps & { lightColor?: string; darkColor?: string }) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const defaultStyle = {
    color,
    backgroundColor,
    fontFamily: "Poppins",
    // Add other default styles here
  };

  return <DefaultTextInput style={[defaultStyle, style]} placeholderTextColor={color} {...otherProps} />;
}
