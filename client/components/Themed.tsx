/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import React, { ReactElement, ReactNode, useState } from "react";
import {
  Pressable as DefaultPressable,
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  Button as DefaultButton,
  ScrollView as DefaultScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardAvoidingView as DefaultKeyboardAvoidingView,
  Platform,
  SafeAreaView as DefaultSafeAreaView,
} from "react-native";
import { LinearGradient as DefaultLinearGradient } from "expo-linear-gradient";

import { BlurView as DefaultBlurView } from "expo-blur";

import { Checkbox as DefaultCheckbox } from "expo-checkbox";

import { CheckBox as DefaultCheckboxRNEUI } from "@rneui/base";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

import { universalStyles } from "@/constants/Styles";
import { ActivityIndicator } from "react-native";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  fontWeight?: string;
};

type ScrollViewPropsSpecific = {
  contentContainerStyle?: object;
  refreshControl?: ReactElement;
  centerContent?: boolean;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type TitleProps = TextProps;
export type ViewProps = ThemeProps & DefaultView["props"];

export type LinearGradientProps = ViewProps & React.ComponentProps<typeof DefaultLinearGradient>;

export type BlurViewProps = ViewProps & {
  opacity: number;
} & React.ComponentProps<typeof DefaultBlurView>;

export type RadioProps = ThemeProps & {
  style?: StyleProp<ViewStyle>;
  onPressIn?: () => void; // Include onPressIn event
  onPressOut?: () => void; // Include onPressOut event
  checked: boolean;
  checkedIcon: string;
  uncheckedIcon: string;
  checkedColor: string;
  title: string | React.ReactElement<{}, string | React.JSXElementConstructor<any>> | undefined;
  onIconPress: () => void;
  textStyle: StyleProp<TextStyle>;
} & React.ComponentProps<typeof DefaultCheckboxRNEUI>;

export type CheckboxProps = ThemeProps & {
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
  isChecked: boolean;
  setChecked: (value: boolean) => void;
} & React.ComponentProps<typeof DefaultCheckbox>;

export type ButtonProps = ThemeProps & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onPressIn?: () => void; // Include onPressIn event
  onPressOut?: () => void; // Include onPressOut event
  waiting?: Boolean;
} & Omit<DefaultButton["props"], "title">;
export type ScrollViewProps = ScrollViewPropsSpecific & ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

function chooseFont(fontWeight?: string): string {
  switch (fontWeight) {
    case "900":
      return "ProximaNova_Black"; // Matches proximanova_black.otf
    case "800":
      return "ProximaNova_ExtraBold"; // Matches proximanova_extrabold.otf
    case "700":
      return "ProximaNova_Bold"; // Matches proximanova_bold.otf
    case "400":
      return "ProximaNova_Regular"; // Matches proximanova_regular.ttf
    case "200":
    case "300":
      return "ProximaNova_ExtraLight"; // Matches proximanova_light.otf
    default:
      return "ProximaNova_Regular"; // Default to regular if fontWeight is undefined or unmatched
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

/*style?: StyleProp<ViewStyle>;
children?: ReactNode;
onPressIn?: () => void; // Include onPressIn event
onPressOut?: () => void; // Include onPressOut event
checkedIcon: string;
uncheckedIcon: string;
checkedColor: string;
title: string | React.ReactElement<{}, string | React.JSXElementConstructor<any>> | undefined;
onIconPress: () => void;
textStyle: StyleProp<TextStyle>; */

export function Radio(props: RadioProps) {
  const { style, checked, lightColor, darkColor, checkedIcon, uncheckedIcon, checkedColor, textStyle, title, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return (
    <DefaultCheckboxRNEUI
      //style={[defaultStyle, style, { backgroundColor: "red", borderColor: "blue", borderWidth: 3 }]}
      checked={checked}
      checkedIcon={checkedIcon}
      title={title}
      checkedColor={checkedColor}
      uncheckedIcon={uncheckedIcon}
      textStyle={textStyle}
      containerStyle={[defaultStyle, style]}
      {...otherProps}
    />
  );
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

  const defaultWeight = "800";
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
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "none");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return <DefaultView style={[defaultStyle, style]} {...otherProps} />;
}

export function LinearGradient(props: LinearGradientProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "none");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return <DefaultLinearGradient style={[defaultStyle, style]} {...otherProps} />;
}

const opacityToHex = (opacity: number): string => {
  const clamped = Math.min(100, Math.max(0, opacity));
  const hexValue = Math.round((clamped / 100) * 255);
  return hexValue.toString(16).padStart(2, "0").toLowerCase();
};

export function BlurView(props: BlurViewProps) {
  const { style, lightColor, darkColor, opacity, intensity, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "none");
  const hexOpacity = opacityToHex(opacity);

  const defaultStyle = {
    backgroundColor: backgroundColor + hexOpacity,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return <DefaultBlurView intensity={intensity} style={[defaultStyle, style]} {...otherProps} />;
}

export function SafeAreaView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "none");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return <DefaultSafeAreaView style={[defaultStyle, style]} {...otherProps} />;
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, contentContainerStyle, refreshControl, centerContent, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return <DefaultScrollView style={[defaultStyle, style]} contentContainerStyle={contentContainerStyle} refreshControl={refreshControl} centerContent={centerContent} {...otherProps} />;
}

export function KeyboardAvoidingView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, contentContainerStyle, refreshControl, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const defaultStyle = {
    backgroundColor: backgroundColor,
    fontFamily: "Poppins_Regular",
    // Add other default styles here
  };

  return (
    <DefaultKeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={200}
      style={[defaultStyle, style]}
      contentContainerStyle={contentContainerStyle}
      //refreshControl={refreshControl}
      {...otherProps}
    />
  );
}

export function Button(props: ButtonProps) {
  const { style, lightColor, darkColor, children, onPress, onPressIn, onPressOut, waiting, ...otherProps } = props;

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
      {waiting && <ActivityIndicator style={{ position: "absolute", top: "50%", right: "10%" }} size="small" color="#FFFFFF" />}
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
  const { style, lightColor, darkColor, lightBgColor, darkBgColor, placeHolderTextColorLight, placeHolderTextColorDark, autoCapitalize, fontWeight, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  //const backgroundColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, "accentBackground");
  const placeholderTextColor = useThemeColor({ light: placeHolderTextColorLight, dark: placeHolderTextColorDark }, "background");
  const autocapitalize = props.autoCapitalize ? props.autoCapitalize : "none";
  const borderColor = useThemeColor({}, "text");

  const [isFilled, setIsFilled] = useState(false);

  const handleInputChange = (event: { nativeEvent: { text: string } }) => {
    setIsFilled(event.nativeEvent.text.trim().length > 0);
  };

  const defaultWeight = isFilled ? "700" : "400";
  const fontFamily = chooseFont(fontWeight ? fontWeight : defaultWeight);

  const defaultStyle = {
    color: color,
    //backgroundColor: backgroundColor,
    fontFamily: fontFamily,
    borderWidth: 1,
    borderColor: borderColor,
    width: "100%",
  };

  return (
    <View>
      <DefaultTextInput
        autoCapitalize={autocapitalize}
        style={[universalStyles.input, defaultStyle, style]}
        placeholderTextColor={placeholderTextColor}
        onChangeText={(value) => console.log("Text:", value)}
        onChange={handleInputChange}
        {...otherProps}
      />
    </View>
  );
}

export function Checkbox(props: CheckboxProps) {
  const { style, lightColor, darkColor, children, isChecked, setChecked, ...otherProps } = props;

  const color = useThemeColor({ light: lightColor, dark: darkColor }, "tint");
  const inactiveColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultCheckbox style={[universalStyles.checkbox, style]} value={isChecked} onValueChange={setChecked} color={isChecked ? color : inactiveColor} />;
}
