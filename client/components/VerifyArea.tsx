import React, { useState, useEffect, useRef } from "react";
import { Button, Pressable, StyleSheet, Animated } from "react-native";

import { Text, View, TextInput } from "./Themed";
import { registerNewUser, loginExistingUser, verifyEmail } from "../services/authService";
import { storeToken } from "../services/tokenStorage";
import { router } from "expo-router";
import { ScreenStackHeaderCenterView } from "react-native-screens";
import { useUserContext } from "@/components/userContext";

import { useThemeColor } from "./Themed";

const VerifyArea: React.FC = () => {
  const [authcode, setAuthcode] = useState<string>("");
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, login, user } = useUserContext();

  const handleRegister = async () => {
    try {
      if (authcode.length > 5) {
        //const userData = await getUserByEmail(email);
        const email = user?.email;
        console.log(email);
        const verifyResponse = await verifyEmail(email, authcode, login);
        //console.log(verifyResponse);
        setResponse(verifyResponse ? verifyResponse.message : null);
        verifyResponse ? console.log(verifyResponse.token ? verifyResponse.token : "NO TOKEN") : null;
        setError(null);
        //console.log("The response is: " + response);
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
      setError(typeof errorMessage == "string" ? errorMessage : "Registration FAILED :(");
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Eg. 123456"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#5700FF"}
        darkColor={"FFFFFF"}
        lightBgColor="#F7F6F8"
        darkBgColor="#5700FF"
        value={authcode}
        onChangeText={setAuthcode}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable style={styles.loginButton} onPress={handleRegister} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Text style={styles.loginButtonText}>Submit</Text>
        </Pressable>
      </Animated.View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {response ? <Text style={styles.userInfo}>{response}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
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
    backgroundColor: "#5700FF",
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
  registerText: {
    textAlign: "center",
    fontSize: 16,
    textDecorationStyle: "solid",
    textDecorationColor: "#5700ff",
    textDecorationLine: "underline",
  },
});

export default VerifyArea;
