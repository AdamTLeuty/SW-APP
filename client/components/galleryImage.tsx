import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "./Themed";

type Asset = {
  id: string;
  uri: string;
};

interface GalleryImageProps {
  asset: Asset;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ asset }) => {
  /* return (
    <View style={styles.rectangleParent}>
      <View style={styles.groupChild} />

      <Image key={asset.id} source={asset.uri} style={styles.groupItem} />
      <Text style={styles.rdSep2024Container}>
        <Text style={styles.rdSep2024Container1}>
          <Text style={styles.rdSep}>{`3rd Sep, `}</Text>
          <Text style={styles.text}>22nd Aug, 2024</Text>
        </Text>
      </Text>
    </View>
  ); */

  return (
    <View style={styles.rectangleParent}>
      <Image key={asset.id} source={asset.uri} style={styles.groupItem} />
      <View style={styles.textHolder}>
        <Text lightColor="#000" fontWeight="700" style={styles.text}>
          22nd Aug,
        </Text>
        <Text lightColor="#5700ff" fontWeight="700" style={styles.text}>
          &nbsp;2024
        </Text>
      </View>
    </View>
  );
};

const styles2 = StyleSheet.create({
  groupChild: {
    top: 0,
    left: 3,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: 176,
    position: "absolute",
    height: 188,
    maxWidth: "100%",
  },
  groupItem: {
    top: 11,
    left: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#959595",
    width: 156,
    height: 136,
    position: "absolute",
    maxWidth: "88%",
  },
  rdSep: {
    color: "#000",
  },
  text: {
    color: "#5700ff",
  },
  rdSep2024Container1: {
    width: "100%",
  },
  rdSep2024Container: {
    top: 152,
    left: 0,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    width: 183,
    maxWidth: "100%",
    height: 29,
    position: "absolute",
  },
  rectangleParent: {
    flex: 1,
    height: 188,
    width: "100%",
  },
});

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
