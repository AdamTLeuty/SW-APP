import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, Image } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";

import * as MediaLibrary from "expo-media-library";

import { useCurrentImageContext } from "@/components/currentImageContext";

export default function ModalScreen() {
  const { image, clearImage } = useCurrentImageContext();

  const toCamera = () => {
    console.log("Remove photo");
    clearImage();
    router.replace("/(loggedIn)/camera");
  };

  const savePhoto = () => {
    console.log("Save photo");
    router.replace("/(loggedIn)/camera");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} fontWeight="800" lightColor="black">
        {"Tuesday,\n3rd September, 2024"}
      </Text>
      {image ? <Image source={{ uri: image.uri }} style={styles.preview} /> : <Text>{"No image taken"}</Text>}
      <Pressable onPress={toCamera} style={[styles.button, styles.retakeButton]}>
        <Text style={styles.buttonText} lightColor="#000" fontWeight="600">
          {"Retake your photo"}
        </Text>
      </Pressable>
      <Pressable onPress={savePhoto} style={[styles.button]}>
        <Text style={styles.buttonText} lightColor="#fff" fontWeight="600">
          {"Save your photo!"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 30,
    gap: 23,
  },
  button: {
    borderRadius: 47,
    backgroundColor: "#5700FF",
    paddingHorizontal: 39,
    paddingVertical: 10,
    textAlign: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 29,
  },
  retakeButton: {
    backgroundColor: "#F7F6F8",
  },
  preview: {
    flex: 1,
    width: "100%",
  },
});
