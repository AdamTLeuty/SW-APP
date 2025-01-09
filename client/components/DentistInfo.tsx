import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Card from "./Card";
import { Text, Title } from "./Themed";
import { universalStyles as styles } from "@/constants/Styles";
import { getDentistInfo } from "@/services/authService";
import { ActivityIndicator } from "react-native";

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

  const fetchDentistInfo = useCallback(async () => {
    try {
      const info = await getDentistInfo(15);
      if (info != null) {
        setDentistInfo(info.dentistData);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!dentistInfo) {
        fetchDentistInfo();
      } else {
        console.log(dentistInfo);
        console.log(error);
      }
    }, [fetchDentistInfo]),
  );

  if (error) {
    console.log("ERROR: " + error);
    return <></>;
  }

  if (!dentistInfo) {
    return (
      <Card style={styles.bottomMargin}>
        <Title style={{ textAlign: "left" }}>{"Practice details"}</Title>
        <Text>
          {"Loading..."}
          <ActivityIndicator size="small" color="#FFFFFF" />
        </Text>
      </Card>
    );
  }

  return (
    <Card style={styles.bottomMargin}>
      <Title style={{ textAlign: "left", marginBottom: 10 }}>{"Practice details"}</Title>
      <Text fontWeight="800">{"Practice name"}</Text>
      <Text>{dentistInfo.name}</Text>
      <Text fontWeight="800">{"Practice Address"}</Text>
      <Text>{`${dentistInfo["address.street_number"]} ${dentistInfo["address.street"]}, ${dentistInfo["address.city"]}\n${dentistInfo["address.region"]}, ${dentistInfo["address.country"]}\n${dentistInfo.postcode}`}</Text>
    </Card>
  );
}
