import React, { useState, useEffect } from "react";
import { Button, Text, SafeAreaView, ScrollView, StyleSheet, View, Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import GalleryImage from "@/components/galleryImage";

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
    const sccAlbum = await MediaLibrary.getAlbumAsync("SCC");

    const theOnlyAlbumThatMatters: Album[] = [sccAlbum];
    setAlbums(theOnlyAlbumThatMatters);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>{albums && albums.map((album) => <AlbumEntry key={album.id} album={album} />)}</ScrollView>
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
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
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
});
