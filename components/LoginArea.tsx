import React, { useState, useEffect } from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View, TextInput } from "./Themed";
import { registerNewUser, loginExistingUser } from "../services/authService";
import { storeToken } from "../services/tokenStorage";
import { useUserContext } from "@/components/userContext";
import { router } from "expo-router";

//import { useRoute } from "@react-navigation/native";

const LoginArea: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
      //const userData = await getUserByEmail(email);
      const registerResponse = await registerNewUser(email, password);
      //console.log(registerResponse);
      setResponse(registerResponse ? registerResponse.message : null);
      registerResponse ? console.log(registerResponse.token ? registerResponse.token : "NO TOKEN") : null;
      setError(null);
      //console.log("The response is: " + response);
    } catch (err) {
      console.error(err);
      const errorMessage = (err as any)?.response?.data?.error;
      setError(typeof errorMessage == "string" ? errorMessage : "Registration FAILED :(");
      setResponse(null);
    }
  };

  const handleLogin = async () => {
    try {
      const loginResponse = await loginExistingUser(email, password, login);
      setResponse(loginResponse ? loginResponse.message : null);
      loginResponse ? console.log(loginResponse.token ? loginResponse.token : "NO TOKEN") : null;
      loginResponse ? storeToken(loginResponse.token) : null;
      setError(null);
    } catch (err) {
      console.error(err + " ... " + typeof err);
      const errorMessage = (err as any)?.response?.data?.error;
      setError(typeof errorMessage == "string" ? errorMessage : "Login FAILED :(");
      setResponse(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Enter email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Enter password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Login" onPress={handleLogin} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {response ? <Text style={styles.userInfo}>{response}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  userInfo: {
    marginTop: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default LoginArea;
