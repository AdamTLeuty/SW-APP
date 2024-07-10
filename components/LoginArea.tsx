// components/UserInfo.tsx

import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View, TextInput } from "./Themed";
import { registerNewUser, loginExistingUser } from "../services/authService";

const LoginArea: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  const register = async () => {
    try {
      //const userData = await getUserByEmail(email);
      const userData = await registerNewUser();
    } catch (err) {
      console.error(err);
    }
  };

  const login = async () => {
    try {
      //const userData = await getUserByEmail(email);
      const userData = await loginExistingUser();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Enter email" value={email} onChangeText={setEmail} />
      <Button title="Register" onPress={register} />
      <Button title="Login" onPress={login} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  },
});

export default LoginArea;
