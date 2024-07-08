import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import UserInfo from "@/components/UserInfo";
import { Text, View } from "@/components/Themed";

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fetch User Data</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>Input a user email to print their contact properties.</Text>
      <UserInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
