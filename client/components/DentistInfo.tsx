import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Card from "./Card";
import { Text, Title } from "./Themed";
import { universalStyles as styles } from "@/constants/Styles";
import { getDentistInfo } from "@/services/authService";
import { ActivityIndicator } from "react-native";
import { useUserContext } from "./userContext";
import Colors from "@/constants/Colors";

// Define the type for the dentist info
interface DentistInfoType {
  id: number;
  jarvisID: number;
  name: string;
  streetNumber: string;
  street: string;
  city: string;
  region: string;
  country: string;
  postcode: string;
}

export default function DentistInfo() {
  const [dentistInfo, setDentistInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { dentistID } = useUserContext();

  const fetchDentistInfo = useCallback(async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_JARVIS_API_KEY;
      if (apiKey) {
        const info = await getDentistInfo(dentistID, apiKey);
        if (info != null) {
          setDentistInfo(info);
          setError(null);
        }
      } else {
        throw new Error("No jarvis api key found:" + apiKey);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, [dentistID]);

  useFocusEffect(
    useCallback(() => {
      if (!dentistInfo) {
        fetchDentistInfo();
      }
    }, [fetchDentistInfo, dentistInfo]),
  );

  useEffect(() => {
    fetchDentistInfo();
  }, [dentistID, fetchDentistInfo]);

  if (error) {
    console.error("ERROR: " + error);
    return <></>;
  }

  if (!dentistInfo) {
    return (
      <Card lightColor={Colors.tint} darkColor={Colors.tint} style={styles.bottomMargin}>
        <Title style={{ textAlign: "left" }}>{"Practice details"}</Title>
        <Text lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
          {"Loading..."}
          <ActivityIndicator size="small" color="#FFFFFF" />
        </Text>
      </Card>
    );
  }

  return (
    <Card lightColor={Colors.tint} darkColor={Colors.tint} style={styles.bottomMargin}>
      <Title lightColor={Colors.dark.text} darkColor={Colors.dark.text} style={{ textAlign: "left", marginBottom: 10 }}>
        {"Practice details"}
      </Title>
      <Text lightColor={Colors.dark.text} darkColor={Colors.dark.text} fontWeight="800">
        {"Practice name"}
      </Text>
      <Text lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
        {dentistInfo.name + `\n`}
      </Text>
      <Text lightColor={Colors.dark.text} darkColor={Colors.dark.text} fontWeight="800">
        {"Practice Address"}
      </Text>
      <Text lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
        {[
          `${dentistInfo.address.street_number} ${dentistInfo.address.street}`,
          `${dentistInfo.address.city}`,
          `${dentistInfo.address.region}, ${dentistInfo.address.country}`,
          `${dentistInfo.postcode}`,
        ]
          .filter((line) => line.trim() !== "" && line.trim() != ",") // Filter out empty lines
          .join("\n")}
      </Text>
    </Card>
  );
}
