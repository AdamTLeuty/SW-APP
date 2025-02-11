import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, Image, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, Button } from "@/components/Themed";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { universalStyles as styles } from "@/constants/Styles";

import * as MediaLibrary from "expo-media-library";

import { useCurrentImageContext } from "@/components/currentImageContext";

import { uploadImage } from "@/services/uploadImage";

import { useUserContext } from "@/components/userContext";
import { SafeAreaView } from "react-native";

export default function ModalScreen() {
  const { image, clearImage } = useCurrentImageContext();
  const { status } = useUserContext();
  const [waiting, setWaiting] = useState<Boolean>(false);

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

  const savePhoto = async () => {
    setWaiting(true);
    console.log("Save photo");
    const imageUri = image.uri;
    console.log(image);

    try {
      // This needs to be a jarvis endpoint first
      //const result = await uploadImage(imageUri, status);
      await saveImageToAlbum(imageUri, "SCC");
      router.back();
      Toast.show({
        type: "success",
        position: "bottom",
        text1: status == "impressionStage" ? "Impressions uploaded successfully" : "Image saved successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Could not save image, please try again",
      });
    }
    setWaiting(false);
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
    <SafeAreaView style={{ height: "100%" }}>
      <View style={[styles.container, { paddingBottom: 50 }]}>
        <Text style={[styles.title, styles.bottomMargin]} fontWeight="800" lightColor="black">
          {status == "impressionStage" ? "Can you clearly see your impressions?" : getDate()}
        </Text>
        {image ? <Image source={{ uri: image.uri }} style={[styles.preview, styles.bottomMargin]} /> : <Text>{"No image taken"}</Text>}
        <Button onPress={toCamera} lightColor="#F7F6F8" darkColor="#F7F6F8">
          <Text style={styles.buttonText} lightColor="#000" darkColor="#000" fontWeight="600">
            {"Retake your photo"}
          </Text>
        </Button>
        <Button onPress={savePhoto} lightColor="#4378ff" darkColor="#4378ff">
          <Text style={styles.buttonText} lightColor="#fff" fontWeight="600">
            {status == "impressionStage" ? (
              <>
                {"Send your photo"} {waiting && <ActivityIndicator size="small" color="#FFFFFF" />}
              </>
            ) : (
              <>
                {"Save your photo"} {waiting && <ActivityIndicator size="small" color="#FFFFFF" />}
              </>
            )}
          </Text>
        </Button>
        <Toast />
      </View>
    </SafeAreaView>
  );
}
