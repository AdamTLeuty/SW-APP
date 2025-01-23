import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback, useRef } from "react";
import "react-native-reanimated";
import { UserProvider, useUserContext } from "@/components/userContext";
import { ImageProvider, useCurrentImageContext } from "@/components/currentImageContext";
import { useColorScheme } from "@/components/useColorScheme";
import * as Font from "expo-font";
import { View } from "@/components/Themed";
import { InteractionManager } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Status } from "@/components/userContext";
import CustomHeader from "@/components/CustomHeader";
import Toast from "react-native-toast-message";

import { handleRegistrationError, registerForPushNotificationsAsync } from "@/services/notificationService";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
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

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ProximaNova_Black: require("@/assets/fonts/proximanova_black.otf"),
          ProximaNova_Bold: require("@/assets/fonts/proximanova_bold.otf"),
          ProximaNova_ExtraBold: require("@/assets/fonts/proximanova_extrabold.otf"), // Matches "extrabld"
          ProximaNova_ExtraLight: require("@/assets/fonts/proximanova_light.otf"),
          ProximaNova_Regular: require("@/assets/fonts/proximanova_regular.ttf"),
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
    <>
      <ActionSheetProvider>
        <UserProvider>
          <ImageProvider>
            <RootLayoutNav />
          </ImageProvider>
        </UserProvider>
      </ActionSheetProvider>
      <Toast />
    </>
  );
}

const userStateChanged = (isLoggedIn: boolean, status: Status, medicalWaiverSigned: Boolean) => {
  if (isLoggedIn) {
    if (status == "alignerStage") {
      if (medicalWaiverSigned) {
        router.replace("/(loggedIn)/home");
      } else {
        router.replace("/(medicalWaiverProcess)/home");
      }
    }
  } else {
    router.replace("/");
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { isLoggedIn, status, updateExpoPushToken, medicalWaiverSigned } = useUserContext();
  const innerStatus = useRef<Status>(status);

  useEffect(() => {
    //sendTokenToServer()
    console.log("Send the expoPushToken to the server: " + expoPushToken);
    updateExpoPushToken(expoPushToken);
  }, [expoPushToken]);

  useEffect(() => {
    userStateChanged(isLoggedIn, status, medicalWaiverSigned);
    console.log("The status has changed to: " + status);
    innerStatus.current = status;
  }, [isLoggedIn, status, medicalWaiverSigned]);

  async function waitForImpressionStage(url: any) {
    return new Promise((resolve) => {
      let timerId = setInterval(checkState, 1000);

      function checkState() {
        if (innerStatus.current === "impressionStage") {
          console.log("In the impression stage, we are in the stage:" + innerStatus.current);

          clearInterval(timerId);
          resolve(innerStatus.current);
          router.push(url);
        } else {
          console.log("Not in the impression stage atm, we are in the stage:" + innerStatus.current);
        }
      }
    });
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    async function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url && url != "") {
        await waitForImpressionStage(url);
      }
    }

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
      redirect(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(loggedIn)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="aligner-change-modal" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="confirm-picture-modal" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="view-picture" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{
            //href: null,
            title: "Settings test",
            header: ({ navigation, route, options }) => {
              return <CustomHeader locked={false} backButton={true} nav={navigation} />;
            },
            headerShown: true,
          }}
        />
        <Stack.Screen name="(impressionProcess)" options={{ headerShown: false }} />
        <Stack.Screen name="impressions_result" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="(medicalWaiverProcess)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

/*

if (status == "alignerStage") {
  //console.log("Is logged in!!");
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(loggedIn)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="aligner-change-modal" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="confirm-picture-modal" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{
            //href: null,
            title: "Settings test",
            header: ({ navigation, route, options }) => {
              return <CustomHeader locked={false} backButton={true} nav={navigation} />;
            },
            headerShown: true,
          }}
        />
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
        <Stack.Screen
          name="settings"
          options={{
            //href: null,
            title: "Settings test",
            header: ({ navigation, route, options }) => {
              return <CustomHeader locked={false} backButton={true} nav={navigation} />;
            },
            headerShown: true,
          }}
        />
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

*/
