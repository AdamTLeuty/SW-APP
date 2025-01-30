import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";

export default function ModalScreen() {
  const { date } = useLocalSearchParams();
  const [image, setImage] = useState<MediaLibrary.Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          const album = await MediaLibrary.getAlbumAsync("SCC");
          if (album) {
            const assets = await MediaLibrary.getAssetsAsync({
              album: album,
              sortBy: [[MediaLibrary.SortBy.creationTime, false]],
              mediaType: [MediaLibrary.MediaType.photo],
            });

            const imageAsset = assets.assets.find((asset) => {
              const assetDate = new Date(asset.creationTime);
              const assetDateString = assetDate.toISOString().split("T")[0];
              return assetDateString === date;
            });

            if (imageAsset) {
              setImage(imageAsset);
            } else {
              setImage(null);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [date]);

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : image ? (
          <Image key={image.id} source={image.uri} style={styles.image} />
        ) : (
          <Text>No image found for this date.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
