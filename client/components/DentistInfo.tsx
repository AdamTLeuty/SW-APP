import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Card from "./Card";
import { Text, Title } from "./Themed";
import { universalStyles as styles } from "@/constants/Styles";
import { getDentistInfo } from "@/services/authService";
import { ActivityIndicator } from "react-native";
import { useUserContext } from "./userContext";

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
      const info = await getDentistInfo(dentistID);
      if (info != null) {
        setDentistInfo(info.dentistData);
        setError(null);
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
