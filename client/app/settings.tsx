import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { ScrollView, Title, TextInput, Text, View, Button } from "@/components/Themed";
import { universalStyles as styles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

import { useUserContext } from "@/components/userContext";
import { useAuth } from "@/context/AuthContext";
import { RefreshControl, Alert } from "react-native";

export default function SettingsScreen() {
  const {
    status,
    updateUserContext,
    alignerCount: userAlignerCount,
    alignerProgress: userAlignerProgress,
    user,
    updateAlignerCount,
    updateAlignerProgress,
    updateUsername,
  } = useUserContext();

  const { deleteUser } = useAuth();

  const [screenKey, setScreenKey] = useState(0); // Step 1: Initialize a key state

  // Step 2: Function to force re-render by changing the key
  const resetScreen = () => {
    setScreenKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  const [username, setUsername] = useState<string>(user ? user.name.toString() : "Set Username");
  const [alignerCount, setAlignerCount] = useState<string>(userAlignerCount.toString());
  const [alignerProgress, setAlignerProgress] = useState<string>(userAlignerProgress.toString());
  const [refreshing, setRefreshing] = React.useState(false);

  const updateSettings = async () => {
    await updateAlignerCount(parseInt(alignerCount, 10));
    await updateAlignerProgress(parseInt(alignerProgress, 10));
    await updateUsername(username);
    await updateUserContext();
    resetScreen();
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await updateUserContext();
    setUsername(user ? user.name.toString() : "Set Username");
    setAlignerCount(userAlignerCount.toString());
    setAlignerProgress(userAlignerProgress.toString());
    resetScreen();
    setRefreshing(false);
  }, []);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser();
              Alert.alert("Account deleted", "Your account has been successfully deleted.");
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Delete user error", "Failed to delete account. Please try again.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setUsername(user ? user.name.toString() : "Set Username");
        setAlignerCount(userAlignerCount.toString());
        setAlignerProgress(userAlignerProgress.toString());
        resetScreen();
      };
    }, []),
  );

  if (status == "alignerStage") {
    return (
      <ScrollView
        key={screenKey}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollcontentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Title style={styles.bottomMargin}>{"Settings"}</Title>
        <SettingSection propertyTitle="Username" value={username} setValue={setUsername} />
        <SettingSection propertyTitle="Aligner Progress" value={alignerProgress} setValue={setAlignerProgress} />
        <SettingSection propertyTitle="Aligner Count" value={alignerCount} setValue={setAlignerCount} />
        <View style={styles.separator} />
        <Button onPress={updateSettings}>{"Update settings"}</Button>
        <Button lightColor={Colors.light.error} darkColor={Colors.dark.error} onPress={handleDeleteAccount}>
          {"Delete Account"}
        </Button>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollcontentContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Title style={styles.bottomMargin}>{"Settings"}</Title>
        <SettingSection propertyTitle="Username" value={username} setValue={setUsername} />
        <View style={styles.separator} />
        <Button onPress={updateSettings}>{"Update settings"}</Button>
      </ScrollView>
    );
  }
}

interface SettingSectionProps {
  propertyTitle: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const SettingSection: React.FC<SettingSectionProps> = ({ propertyTitle, value, setValue }) => {
  useEffect(() => {}, [value]);

  return (
    <View style={{ borderColor: "#F7F6F8", borderTopWidth: 1, width: "100%", paddingVertical: 15, paddingHorizontal: 17, gap: 10 }}>
      <Text fontWeight="600" style={styles.subtitle}>
        {propertyTitle}
      </Text>
      <TextInput
        style={{ padding: 0, paddingVertical: 0, paddingLeft: 0, margin: 0, includeFontPadding: false, borderColor: "#00000000", borderWidth: 0 }}
        placeHolderTextColorLight={"#BDBDBD"}
        placeHolderTextColorDark={Colors.dark.text}
        lightBgColor={Colors.light.background}
        darkBgColor={Colors.dark.background}
        placeholder={value}
        onChangeText={setValue}
      />
    </View>
  );
};
