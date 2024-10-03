/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import React, { ReactElement, ReactNode } from "react";
import {
  Pressable as DefaultPressable,
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  Button as DefaultButton,
  ScrollView as DefaultScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

import { universalStyles } from "@/constants/Styles";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  fontWeight?: string;
};

type ScrollViewPropsSpecific = {
  contentContainerStyle?: object;
  refreshControl?: ReactElement;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type TitleProps = TextProps;
export type ViewProps = ThemeProps & DefaultView["props"];
export type ButtonProps = ThemeProps & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onPressIn?: () => void; // Include onPressIn event
  onPressOut?: () => void; // Include onPressOut event
} & Omit<DefaultButton["props"], "title">;
export type ScrollViewProps = ScrollViewPropsSpecific & ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

function chooseFont(fontWeight?: string): string {
  if (fontWeight == "900") {
    return "Poppins_Black";
  } else if (fontWeight == "800") {
    return "Poppins_ExtraBold";
  } else if (fontWeight == "700") {
    return "Poppins_Bold";
  } else if (fontWeight == "600") {
    return "Poppins_SemiBold";
  } else if (fontWeight == "500") {
    return "Poppins_Medium";
  } else if (fontWeight == "400") {
    return "Poppins_Regular";
  } else if (fontWeight == "300") {
    return "Poppins_Light";
  } else if (fontWeight == "200") {
    return "Poppins_ExtraLight";
  } else if (fontWeight == "100") {
    return "Poppins_Thin";
  } else {
    return "Poppins_Regular"; // Default font if no match is found
  }
}

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
  const { style, lightColor, darkColor, fontWeight, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  //I need to find the fontWeight from the variable 'style' for the function below
  const fontFamily = chooseFont(fontWeight);

  const defaultStyle = {
    color: color,
    fontFamily: fontFamily,
  };

  return <DefaultText style={[defaultStyle, style]} {...otherProps} />;
}

export function Title(props: TextProps) {
  const { style, lightColor, darkColor, fontWeight, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const defaultWeight = "900";
  const fontFamily = chooseFont(fontWeight ? fontWeight : defaultWeight);

  const textBreakStrategy = props.textBreakStrategy ? props.textBreakStrategy : "balanced";

  const defaultStyle = {
    color: color,
    fontFamily: fontFamily,
  };

  return <DefaultText style={[universalStyles.title, defaultStyle, style]} textBreakStrategy={textBreakStrategy} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return <DefaultView style={[defaultStyle, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, contentContainerStyle, refreshControl, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return <DefaultScrollView style={[defaultStyle, style]} contentContainerStyle={contentContainerStyle} refreshControl={refreshControl} {...otherProps} />;
}

export function Button(props: ButtonProps) {
  const { style, lightColor, darkColor, children, onPress, onPressIn, onPressOut, ...otherProps } = props;

  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "button");
  const customStyle =
    backgroundColor == undefined
      ? {}
      : {
          backgroundColor: backgroundColor,
        };

  return (
    <DefaultPressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={[universalStyles.bottomMargin, universalStyles.alignerChangeButton, style, customStyle]}>
      <Text style={universalStyles.alignerChangeText} lightColor="#fff" fontWeight="600" numberOfLines={1} adjustsFontSizeToFit={true}>
        {children}
      </Text>
    </DefaultPressable>
  );
}

export function TextInput(
  props: TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    lightBgColor?: string;
    darkBgColor?: string;
    placeHolderTextColorLight?: string;
    placeHolderTextColorDark?: string;
  },
) {
  const { style, lightColor, darkColor, lightBgColor, darkBgColor, placeHolderTextColorLight, placeHolderTextColorDark, autoCapitalize, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, "accentBackground");
  const placeholderTextColor = useThemeColor({ light: placeHolderTextColorLight, dark: placeHolderTextColorDark }, "background");
  const autocapitalize = props.autoCapitalize ? props.autoCapitalize : "none";
  const defaultStyle = {
    color: color,
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    width: "100%",
    // Add other default styles here
  };

  return <DefaultTextInput autoCapitalize={autocapitalize} style={[universalStyles.input, defaultStyle, style]} placeholderTextColor={placeholderTextColor} {...otherProps} />;
}
