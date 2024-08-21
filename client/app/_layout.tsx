import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback } from "react";
import "react-native-reanimated";
import { UserProvider, useUserContext } from "@/components/userContext";
import { ImageProvider, useCurrentImageContext } from "@/components/currentImageContext";
import { useColorScheme } from "@/components/useColorScheme";
import * as Font from "expo-font";
import { View } from "@/components/Themed";
import { InteractionManager } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { Status } from "@/components/userContext";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          Poppins_Black: require("@/assets/fonts/Poppins-Black.ttf"),
          Poppins_BlackItalic: require("@/assets/fonts/Poppins-BlackItalic.ttf"),
          Poppins_Bold: require("@/assets/fonts/Poppins-Bold.ttf"),
          Poppins_BoldItalic: require("@/assets/fonts/Poppins-BoldItalic.ttf"),
          Poppins_ExtraBold: require("@/assets/fonts/Poppins-ExtraBold.ttf"),
          Poppins_ExtraBoldItalic: require("@/assets/fonts/Poppins-ExtraBoldItalic.ttf"),
          Poppins_ExtraLight: require("@/assets/fonts/Poppins-ExtraLight.ttf"),
          Poppins_ExtraLightItalic: require("@/assets/fonts/Poppins-ExtraLightItalic.ttf"),
          Poppins_Italic: require("@/assets/fonts/Poppins-Italic.ttf"),
          Poppins_Light: require("@/assets/fonts/Poppins-Light.ttf"),
          Poppins_LightItalic: require("@/assets/fonts/Poppins-LightItalic.ttf"),
          Poppins_Medium: require("@/assets/fonts/Poppins-Medium.ttf"),
          Poppins_MediumItalic: require("@/assets/fonts/Poppins-MediumItalic.ttf"),
          Poppins_Regular: require("@/assets/fonts/Poppins-Regular.ttf"),
          Poppins_SemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
          Poppins_SemiBoldItalic: require("@/assets/fonts/Poppins-SemiBoldItalic.ttf"),
          Poppins_Thin: require("@/assets/fonts/Poppins-Thin.ttf"),
          Poppins_ThinItalic: require("@/assets/fonts/Poppins-ThinItalic.ttf"),
          ...FontAwesome.font,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Ensure that all interactions (like layout) are complete before hiding the splash screen
      InteractionManager.runAfterInteractions(async () => {
        await SplashScreen.hideAsync();
      });
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <UserProvider>
      <ImageProvider>
        <RootLayoutNav />
      </ImageProvider>
    </UserProvider>
  );
}

const userStateChanged = (isLoggedIn: boolean, status: Status) => {
  if (isLoggedIn) {
    if (status == "impressionStage") {
      router.replace("/(impressionProcess)/home");
    } else if (status == "alignerStage") {
      router.replace("/(loggedIn)/home");
    }
  } else {
    router.replace("/");
  }
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const { isLoggedIn, status } = useUserContext();

  useEffect(() => {
    userStateChanged(isLoggedIn, status);
  }, [isLoggedIn, status]);

  if (status == "alignerStage") {
    //console.log("Is logged in!!");
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(loggedIn)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="aligner-change-modal" options={{ presentation: "modal", headerShown: false }} />
          <Stack.Screen name="confirm-picture-modal" options={{ presentation: "modal", headerShown: false }} />
        </Stack>
      </ThemeProvider>
    );
  } else if (status == "impressionStage") {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(impressionProcess)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="confirm-picture-modal" options={{ presentation: "modal", headerShown: false }} />
          <Stack.Screen name="impressions_result" options={{ presentation: "modal", headerShown: false }} />
        </Stack>
      </ThemeProvider>
    );
  } else {
    //console.log("Isn't logged in!!!");
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    );
  }
}
