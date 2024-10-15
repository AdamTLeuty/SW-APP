import React, { useState, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";

import { Text, View, TextInput, useThemeColor, Button, ScrollView } from "./Themed";
import { registerNewUser, loginExistingUser, loginExistingUserWithToken } from "../services/authService";
import { storeToken, deleteToken } from "../services/tokenStorage";
import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { ScreenStackHeaderCenterView } from "react-native-screens";
import Colors from "@/constants/Colors";

import { getToken } from "../services/tokenStorage";

//import { useRoute } from "@react-navigation/native";

const LoginArea: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, login, tentativeLogin } = useUserContext();

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("Not logged in");
      const token = async () => await getToken();
      if (token != null) {
        handleLoginWithToken();
      }
    }
  }, [isLoggedIn]);

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

  const handleLogin = async () => {
    try {
      const loginResponse = await loginExistingUser(email, password, login, tentativeLogin);
      setResponse(loginResponse ? loginResponse.message : null);
      //loginResponse ? console.log(loginResponse.token ? loginResponse.token : "NO TOKEN") : null;
      //loginResponse ? storeToken(loginResponse.token) : null;
      setError(null);
    } catch (err) {
      console.error(err + " ... " + typeof err);
      const errorMessage = (err as any)?.response?.data?.error;
      const status = (err as any)?.response?.status;
      if (status == 403) {
        //Email has not been verified, go to verification screen
        console.log("Email has not been verified, go to verification screen");
        router.navigate("/(tabs)/verify");
      }
      setError(typeof errorMessage == "string" ? errorMessage : "Login failed");
      setResponse(null);
    }
  };

  const handleLoginWithToken = async () => {
    try {
      const token = await getToken();
      let loginResponse;
      if (typeof token == "string") {
        loginResponse = await loginExistingUserWithToken(token, login);
      } else {
        console.log("There is no saved token");
        return;
      }

      //setResponse(loginResponse ? loginResponse.message : null);
      setResponse("Session expired, please log in again");
      setError(null);
    } catch (err) {
      setError(null);
      setResponse(null);
      await deleteToken();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#5700FF"}
        darkColor={"#FFFFFF"}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#5700FF"}
        darkColor={"#FFFFFF"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Animated.View style={{ transform: [{ scale }] }}>
        <Button onPress={handleLogin} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          Login
        </Button>
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

export default LoginArea;
