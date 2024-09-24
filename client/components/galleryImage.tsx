import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "./Themed";
import * as MediaLibrary from "expo-media-library";

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
    <View style={styles.rectangleParent}>
      <Image key={asset.id} source={asset.uri} style={styles.groupItem} />
      <View style={styles.textHolder}>
        <Text lightColor="#000" fontWeight="700" style={styles.text}>
          {dateUnixToHuman(asset.modificationTime, "dayAndMonth")}
        </Text>
        <Text lightColor="#5700ff" fontWeight="700" style={styles.text}>
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
    backgroundColor: "white",
    borderRadius: 10,
    minWidth: "40%",
    alignItems: "center",
    paddingTop: 11,
    paddingHorizontal: 11,
    paddingBottom: 6,
    gap: 5,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25, // 40 in hex equals 25% opacity
    shadowRadius: 4,
    elevation: 4, // For Android shadow
  },
  groupItem: {
    //top: 11,
    //left: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#959595",
    width: "100%",
    height: 136,
    //position: "absolute",
    maxWidth: "100%",
  },
  textHolder: {
    flexDirection: "row",
  },
  text: {},
});

export default GalleryImage;
