import React, { useState, useEffect } from "react";
import { Button, SafeAreaView, StyleSheet, Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import GalleryImage from "@/components/galleryImage";
import { View, ScrollView, Text, Title } from "@/components/Themed";
import { universalStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

// Define types for Album and Asset
type Album = {
  id: string;
  title: string;
  assetCount?: number;
};

type Asset = {
  id: string;
  uri: string;
  modificationTime: string;
};

// Define a type for the App component's state
type AppState = {
  albums: Album[] | null;
  permissionResponse: MediaLibrary.PermissionResponse | null;
};

export default function Gallery() {
  const [albums, setAlbums] = useState<AppState["albums"]>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    getAlbums();
  }, []);

  async function getAlbums() {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    const sccAlbum = await MediaLibrary.getAlbumAsync("Smile White");

    if (sccAlbum) {
      const theOnlyAlbumThatMatters: Album[] = [sccAlbum];
      setAlbums(theOnlyAlbumThatMatters);
    } else {
      // Handle the case where sccAlbum is null or undefined
      console.warn("The album 'Smile White' was not found.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {albums == null ? (
        <View style={styles.warning}>
          <Text style={styles.warningText} fontWeight="600">
            No photos in gallery - take your first progress picture now!
          </Text>
        </View>
      ) : (
        <ScrollView>
          <Title> PHOTO GALLERY </Title>
          {albums && albums.map((album) => <AlbumEntry key={album.id} album={album} />)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Define the props for AlbumEntry component
type AlbumEntryProps = {
  album: Album;
};

function AlbumEntry({ album }: AlbumEntryProps) {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets as Asset[]);
      for (const asset in assets) {
        console.log(assets[asset]);
      }
    }
    getAlbumAssets();
  }, [album]);

  return (
    <View key={album.id} style={styles.albumContainer}>
      <View style={styles.albumAssetsContainer}>{assets && assets.map((asset) => <GalleryImage asset={asset} />)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    gap: 8,
    justifyContent: "center",
    paddingTop: 10,
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    padding: 20,
    gap: 4,
  },
  albumAssetsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  image: {
    width: "auto",
    flex: 1,
    maxWidth: "50%",
    height: 100,
    minWidth: 50,
    margin: 5,
    borderWidth: 1,
  },
  warning: {
    flex: 1,
    padding: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    textAlign: "center",
    fontSize: 20,
  },
});
