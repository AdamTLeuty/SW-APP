import { View, ViewProps } from "./Themed";
import React from "react";
import Colors from "@/constants/Colors";

const Card: React.FC<ViewProps> = ({ children, style, ...otherProps }) => {
  return (
    <View
      lightColor={Colors.light.accentBackground}
      darkColor={Colors.dark.accentBackground}
      style={[style, { width: "100%", justifyContent: "center", paddingHorizontal: 27, paddingVertical: 24, borderRadius: 20 }]}
      {...otherProps}
    >
      {children}
    </View>
  );
};

export default Card;
