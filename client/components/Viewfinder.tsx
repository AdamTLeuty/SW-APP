import React, { useState, useEffect, useRef } from "react";
import { Image, Button, StyleSheet, TouchableOpacity, LayoutChangeEvent } from "react-native";
import * as MediaLibrary from "expo-media-library";

import { Text, View, TextInput } from "./Themed";

import { CameraView, useCameraPermissions, CameraType } from "expo-camera";

import { router } from "expo-router";

import { Svg, Path, Rect, Circle, Ellipse } from "react-native-svg";

import { useCurrentImageContext } from "@/components/currentImageContext";

import { useUserContext } from "./userContext";

function FlipIcon() {
  return (
    <Svg width="35" height="35" viewBox="0 0 35 35" fill="none">
      <Path
        d="M32.2739 22.2106C31.4685 21.8587 30.5308 22.2263 30.1791 23.0314C27.9767 28.0721 23 31.329 17.5002 31.329C13.1406 31.329 9.11012 29.28 6.52897 25.9197L11.9624 27.0005C12.8242 27.172 13.6615 26.6122 13.833 25.7504C14.0044 24.8887 13.4447 24.0512 12.583 23.8798L3.67366 22.1077C2.81194 21.9367 1.9745 22.4959 1.803 23.3577L0.0308651 32.267C-0.140526 33.1287 0.419146 33.9663 1.28087 34.1377C1.38566 34.1585 1.49002 34.1685 1.5929 34.1685C2.33637 34.1685 3.00093 33.6446 3.15154 32.8877L4.12176 28.0098C7.30055 32.0531 12.2036 34.5108 17.5002 34.5108C24.2646 34.5108 30.3859 30.505 33.0947 24.3053C33.4464 23.5003 33.079 22.5624 32.2739 22.2106Z"
        fill="white"
      />
      <Path
        d="M33.7191 0.861174C32.8574 0.689995 32.0199 1.24945 31.8485 2.11118L30.8781 6.98956C27.6992 2.94661 22.7963 0.489014 17.5002 0.489014C10.7359 0.489014 4.61461 4.49496 1.90556 10.6944C1.55376 11.4995 1.92125 12.4374 2.72634 12.7892C2.9338 12.8797 3.14984 12.9227 3.36259 12.9227C3.97572 12.9227 4.55999 12.5661 4.82122 11.9684C7.02384 6.92773 12.0006 3.67067 17.5003 3.67067C21.8592 3.67067 25.8896 5.7193 28.4707 9.07913L23.0375 7.99829C22.1756 7.827 21.3383 8.38646 21.1668 9.24819C20.9954 10.1099 21.5549 10.9475 22.4167 11.119L31.3262 12.8913C31.4292 12.9118 31.5332 12.9218 31.6367 12.9218C31.949 12.9218 32.257 12.8298 32.5205 12.6537C32.8713 12.4193 33.1146 12.0551 33.1969 11.6413L34.969 2.73173C35.1405 1.87011 34.5809 1.03256 33.7191 0.861174Z"
        fill="white"
      />
    </Svg>
  );
}

function GalleryIcon() {
  return (
    <Svg width="35" height="35" viewBox="0 0 35 35" fill="none">
      <Rect width="15" height="15" rx="3" fill="white" />
      <Rect y="20" width="15" height="15" rx="3" fill="white" />
      <Rect x="20" width="15" height="15" rx="3" fill="white" />
      <Rect x="20" y="20" width="15" height="15" rx="3" fill="white" />
    </Svg>
  );
}

function Shutter_Button() {
  return (
    <Svg width="79" height="79" viewBox="0 0 79 79" fill="none">
      <Rect x="8" y="8" width="63" height="63" rx="31.5" fill="#5700FF" fill-opacity="0.5" />
      <Rect x="2" y="2" width="75" height="75" rx="37.5" stroke="white" strokeWidth="4" />
    </Svg>
  );
}

function FrameTop() {
  return (
    <View style={styles.frameTop}>
      <View style={[styles.rule, styles.rightCurve]} />
      <Text style={styles.frame_text} lightColor="white" fontWeight="800">
        {"Keep face in frame"}
      </Text>
      <View style={[styles.rule, styles.leftCurve]} />
    </View>
  );
}

function FrameBottom() {
  return (
    <View style={styles.frameBottom}>
      <View style={[styles.rule, styles.rightCurve]} />
      <View style={styles.rule_spacer} />
      <View style={[styles.rule, styles.leftCurve]} />
    </View>
  );
}

const Viewfinder: React.FC = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] = MediaLibrary.usePermissions();
  const [maxHeight, setMaxHeight] = useState(0);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const { status } = useUserContext();

  const { newImage } = useCurrentImageContext();

  if (!cameraPermission || libraryPermission?.status == "denied") {
    requestLibraryPermission();
    // Camera permissions are still loading.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera, please allow 'Camera' and 'Photos' access in settings</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || libraryPermission?.status != "granted") {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera and store the resulting picture</Text>
        <Button
          onPress={() => {
            requestCameraPermission();
            requestLibraryPermission();
          }}
          title="Grant Permission"
        />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function openGallery() {
    setFacing((current) => (current === "back" ? "front" : "back"));
    router.navigate("/gallery");
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      setPhoto(photo);
      newImage({ uri: photo.uri });
      router.navigate("/confirm-picture-modal");
    }
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > maxHeight) {
      setMaxHeight(height);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          {status == "alignerStage" ? (
            <>
              <TouchableOpacity style={[styles.gallery]} onPress={openGallery} onLayout={onLayout}>
                <GalleryIcon />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.gallery} />
          )}

          <TouchableOpacity style={[styles.shutter_button]} onPress={takePicture} onLayout={onLayout}>
            <Shutter_Button />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.flip]} onPress={toggleCameraFacing} onLayout={onLayout}>
            <FlipIcon />
          </TouchableOpacity>
        </View>
      </CameraView>
      {status == "alignerStage" && (
        <>
          <FrameTop />
          <FrameBottom />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  frameTop: {
    position: "absolute",
    backgroundColor: "#ffffff00",
    top: "17%",
    //paddingTop: "13%",
    //borderWidth: 1,
    //borderColor: "red",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rule_spacer: {
    width: "30%",
    height: 0,
    color: "#00000000",
  },
  frameBottom: {
    position: "absolute",
    backgroundColor: "#ffffff00",
    //backgroundColor: "red",
    bottom: "24%",
    //paddingTop: "13%",
    //borderWidth: 1,
    //borderColor: "red",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  frame_text: {
    fontSize: 25,
    flex: 0,
    textAlign: "center",
  },
  rule: {
    flex: 1,
    height: 5,
    backgroundColor: "white",
    //borderRadius: 10,
  },
  leftCurve: {
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  rightCurve: {
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  svg: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 28,
    alignItems: "center",
    marginTop: "auto",
  },
  preview: {
    flex: 1,
    width: "100%",
  },

  gallery: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  shutter_button: {
    flex: 1,
    alignItems: "center",
  },
  flip: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default Viewfinder;
