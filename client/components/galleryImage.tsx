import * as React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Text, View } from "./Themed";
import * as MediaLibrary from "expo-media-library";
import Colors from "@/constants/Colors";

type Asset = {
  id: string;
  uri: string;
  modificationTime: string;
};

interface GalleryImageProps {
  asset: Asset;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ asset }) => {
  const nth = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dateUnixToHuman = (timestamp: string, part: string) => {
    const date = new Date(timestamp);

    const optionsWeekday: Intl.DateTimeFormatOptions = { day: "numeric" };
    const optionsMonth: Intl.DateTimeFormatOptions = { month: "short" };
    const optionsYear: Intl.DateTimeFormatOptions = { year: "numeric" };

    if (part == "year") {
      const formattedDate = ` ${date.toLocaleDateString("en-UK", optionsYear)}`;
      return formattedDate;
    } else {
      const formattedDate = `${date.toLocaleDateString("en-UK", optionsWeekday)}${nth(Number(date.toLocaleDateString("en-UK", optionsWeekday)))} ${date.toLocaleDateString("en-UK", optionsMonth)}`;
      return formattedDate;
    }
  };

  return (
    <View style={styles.rectangleParent} lightColor={Colors.light.surface} darkColor={Colors.dark.surface}>
      <Image key={asset.id} source={asset.uri} style={styles.groupItem} />
      <View style={styles.textHolder} lightColor="#00000000" darkColor="#00000000">
        <Text lightColor="#000" fontWeight="400" style={styles.text}>
          {dateUnixToHuman(asset.modificationTime, "dayAndMonth")}
        </Text>
        <Text lightColor={Colors.light.tint} darkColor={Colors.dark.tint} fontWeight="700" style={styles.text}>
          {dateUnixToHuman(asset.modificationTime, "year")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangleParent: {
    flex: 1,
    height: "auto",
    width: "50%",
    maxWidth: "50%",
    //backgroundColor: "white",
    borderRadius: 10,
    minWidth: "40%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  groupItem: {
    //top: 11,
    //left: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#959595",
    width: "100%",
    height: "auto",
    aspectRatio: 1.16,
    //position: "absolute",
    maxWidth: "100%",
  },
  textHolder: {
    flexDirection: "row",
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  text: {
    fontSize: 18,
  },
});

export default GalleryImage;
