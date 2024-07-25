// components/UserInfo.tsx

import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View, TextInput } from "./Themed";
import { getUserByEmail, getUserLeadDetailsByEmail } from "../services/hubspotService";

const UserInfo: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  const fetchUser = async () => {
    try {
      //const userData = await getUserByEmail(email);
      const userData = await getUserLeadDetailsByEmail(email);
      //console.log("USERDATA: \n");
      //console.log(userData);
      //console.log("USERDATA ABOVE!");
      setUser(userData);
      //console.log("User is: " + user);
      setError("");
    } catch (err) {
      setError("Error fetching user data. Please check the email and try again.");
      console.error(err);
      setUser(null);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Enter email" value={email} onChangeText={setEmail} />
      <Button title="Fetch User" onPress={fetchUser} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {user && (
        <View style={styles.userInfo}>
          <Text lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
            Name: {user.firstname} {user.lastname}
          </Text>
          <Text>Email: {user.email}</Text>
          <Text>Arch Type: {user.arch_type}</Text>
          <Text>Medical Waiver Sent? {user.medical_waiver_sent ? user.medical_waiver_sent : "False"}</Text>
          <Text>Medical Waiver Signed? {user.medical_waiver_signed ? user.medical_waiver_signed : "False"}</Text>
          {/* Add other user details as needed */}
        </View>
      )}
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

export default UserInfo;
