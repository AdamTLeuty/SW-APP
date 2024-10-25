import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, Button } from "@/components/Themed";
import { router } from "expo-router";

import { universalStyles as styles } from "@/constants/Styles";

import * as MediaLibrary from "expo-media-library";

import { useCurrentImageContext } from "@/components/currentImageContext";

import { uploadImage } from "@/services/uploadImage";

import { useUserContext } from "@/components/userContext";

export default function ModalScreen() {
  const { image, clearImage } = useCurrentImageContext();
  const { status } = useUserContext();

  // Function to create or get the album
  async function getOrCreateAlbum(albumName: string, asset: MediaLibrary.Asset): Promise<MediaLibrary.Album> {
    const album = await MediaLibrary.getAlbumAsync(albumName);
    if (!album) {
      return await MediaLibrary.createAlbumAsync(albumName, asset, false);
    }
    return album;
  }

  // Function to save image to the album
  async function saveImageToAlbum(uri: string, albumName: string): Promise<void> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await getOrCreateAlbum(albumName, asset);
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    } else {
      console.log("Permission to access media library denied");
    }
  }

  const toCamera = () => {
    console.log("Remove photo");
    clearImage();
    //router.replace("/camera");
    router.back();
  };

  const savePhoto = () => {
    console.log("Save photo");
    // Example usage
    const imageUri = image.uri;
    console.log(image);
    saveImageToAlbum(imageUri, "SCC");
    uploadImage(imageUri, status);
    //router.replace("/camera");
    router.back();
  };

  const getDate = () => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const today = new Date();

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
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

    const day = today.getDate();
    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
    const formattedDate = today.toLocaleDateString("en-UK", options).replace(today.getDate(), dayWithSuffix).replace(",", ",\n");

    return formattedDate;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.bottomMargin]} fontWeight="800" lightColor="black">
        {status == "impressionStage" ? "Can you clearly see your impressions?" : getDate()}
      </Text>
      {image ? <Image source={{ uri: image.uri }} style={[styles.preview, styles.bottomMargin]} /> : <Text>{"No image taken"}</Text>}
      <Button onPress={toCamera} lightColor="#F7F6F8" darkColor="#F7F6F8">
        <Text style={styles.buttonText} lightColor="#000" darkColor="#000" fontWeight="600">
          {"Retake your photo"}
        </Text>
      </Button>
      <Button onPress={savePhoto} lightColor="#5700FF" darkColor="#5700FF">
        <Text style={styles.buttonText} lightColor="#fff" fontWeight="600">
          {status == "impressionStage" ? "Send your photo" : "Save your photo"}
        </Text>
      </Button>
    </View>
  );
}
