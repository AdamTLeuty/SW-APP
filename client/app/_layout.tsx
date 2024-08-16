import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { UserProvider, useUserContext } from "@/components/userContext";
import { ImageProvider, useCurrentImageContext } from "@/components/currentImageContext";
import { useColorScheme } from "@/components/useColorScheme";

import { useRoute } from "@react-navigation/native";
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

type Status = "loggedOut" | "impressionStage" | "alignerStage";

export default function RootLayout() {
  const [loaded, error] = useFonts({
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

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
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
    console.log("Logged in?: " + isLoggedIn);
    userStateChanged(isLoggedIn, status);
    () => {
      console.log("Testing again");
    };
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
