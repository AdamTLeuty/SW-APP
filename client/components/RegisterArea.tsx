import React, { useState, useEffect, useRef } from "react";
import { Button, Pressable, StyleSheet, Animated } from "react-native";

import { Text, View, TextInput } from "./Themed";
import { registerNewUser, loginExistingUser } from "../services/authService";
import { storeToken } from "../services/tokenStorage";
import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";
import { ScreenStackHeaderCenterView } from "react-native-screens";

import { useThemeColor } from "./Themed";

//import { useRoute } from "@react-navigation/native";

const RegisterArea: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, login } = useUserContext();
  //const routeTest = useRoute();

  useEffect(() => {
    //console.log("Current route:" + routeTest.name);
    if (isLoggedIn) {
      //console.log("Before the routing change");
      router.replace("/(loggedIn)/home");
      //console.log("After the routing change");
    }
  }, [isLoggedIn]);

  const handleRegister = async () => {
    try {
      if (password === passwordConfirm) {
        //const userData = await getUserByEmail(email);
        const registerResponse = await registerNewUser(email, password, login);
        //console.log(registerResponse);
        setResponse(registerResponse ? registerResponse.message : null);
        registerResponse ? console.log(registerResponse.token ? registerResponse.token : "NO TOKEN") : null;
        setError(null);
        //console.log("The response is: " + response);
      } else {
        throw {
          response: {
            data: {
              error: "Passwords must match",
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
        placeholder="*Username"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#5700FF"}
        darkColor={"FFFFFF"}
        lightBgColor="#F7F6F8"
        darkBgColor="#5700FF"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="*Email"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#5700FF"}
        darkColor={"FFFFFF"}
        lightBgColor="#F7F6F8"
        darkBgColor="#5700FF"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="*Password"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#5700FF"}
        darkColor={"FFFFFF"}
        lightBgColor="#F7F6F8"
        darkBgColor="#5700FF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TextInput
        style={styles.input}
        placeholder="*Password"
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={"#FFFFFF"}
        lightColor={"#5700FF"}
        darkColor={"FFFFFF"}
        lightBgColor="#F7F6F8"
        darkBgColor="#5700FF"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry={true}
      />

      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable style={styles.loginButton} onPress={handleRegister} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Text style={styles.loginButtonText}>Register</Text>
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

export default RegisterArea;
