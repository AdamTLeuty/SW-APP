import React, { useState, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import Toast from "react-native-toast-message";
import { Text, View, TextInput } from "./Themed";
import { registerNewUser, loginExistingUser, verifyEmail, requestNewAuthCode } from "../services/authService";
import { storeToken } from "../services/tokenStorage";
import { router } from "expo-router";
import { ScreenStackHeaderCenterView } from "react-native-screens";
import { useUserContext } from "@/components/userContext";

import { useThemeColor, Button } from "./Themed";
import { universalStyles } from "@/constants/Styles";

const VerifyArea: React.FC = () => {
  const [authcode, setAuthcode] = useState<string>("");
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);
  const { isLoggedIn, login, user } = useUserContext();

  const handleVerify = async () => {
    try {
      if (authcode.length > 5) {
        const email = user.email ? user.email : "";
        console.log("Email: " + email);
        const verifyResponse = await verifyEmail(email, authcode, login);
        setResponse(verifyResponse ? verifyResponse.message : null);
        verifyResponse ? console.log(verifyResponse.token ? verifyResponse.token : "NO TOKEN") : null;
        setError(null);
      } else {
        throw {
          response: {
            data: {
              error: "Your auth code is 6 digits long, please check your email again",
            },
          },
        };
      }
    } catch (err) {
      console.error(err);
      const errorMessage = (err as any)?.response?.data?.error;
      setError(typeof errorMessage == "string" ? errorMessage : "Verification failed");
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error ? error : "Verification failed",
      });
      setResponse(null);
    }
  };

  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleResend = async () => {
    try {
      console.log("Asking server to resend verification email");
      setAwaitingResponse(true);
      const email = user?.email ? user.email : "";
      console.log(email);
      const verifyResponse = await requestNewAuthCode(email ? email : "");
      setResponse(verifyResponse ? verifyResponse.message : null);
      setError(null);
      setTimeout(() => {
        setAwaitingResponse(false);
      }, 500);
    } catch (err) {
      console.error(err);
      const errorMessage = (err as any)?.response?.data?.error;
      setError(typeof errorMessage == "string" ? errorMessage : "Failed to request new confirmation email");
      Toast.show({
        type: "error",
        position: "bottom",
        text1: error ? error : "Failed to request new confirmation email",
      });
      setResponse(null);
      setTimeout(() => {
        setAwaitingResponse(false);
      }, 500);
    }
  };

  return (
    <View style={[styles.container, awaitingResponse ? styles.disabled : null]}>
      <TextInput
        style={[universalStyles.bottomMargin]}
        placeholder="Eg. 123456"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#4378ff"}
        darkColor={"#FFFFFF"}
        value={authcode}
        onChangeText={setAuthcode}
      />

      <Animated.View style={{ transform: [{ scale }] }}>
        <Button onPress={handleVerify} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          {"Submit"}
        </Button>
      </Animated.View>

      <Text style={styles.orText}> {"or"}</Text>

      <Pressable onPress={handleResend}>
        <Text style={styles.resendText}>Resend confirmation email</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    verticalAlign: "bottom",
    elevation: -100,
  },
  userInfo: {
    marginTop: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#4378ff",
    color: "white",
    width: "100%",
    textAlign: "center",
    padding: 11,
    borderRadius: 47,
    marginTop: 23,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  orText: {
    fontSize: 16,
    marginVertical: 14,
    padding: 0,
    textAlign: "center",
    width: "100%",
  },
  resendText: {
    textAlign: "center",
    fontSize: 16,
    textDecorationStyle: "solid",
    textDecorationColor: "#4378ff",
    textDecorationLine: "underline",
  },
});

export default VerifyArea;
