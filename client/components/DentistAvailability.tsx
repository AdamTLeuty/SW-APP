import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Card from "./Card";
import { Text, Title } from "./Themed";
import { universalStyles as styles } from "@/constants/Styles";
import { getDentistAvailability } from "@/services/authService";
import { ActivityIndicator, View, ScrollView, Button } from "react-native";
import { useUserContext } from "./userContext";
import Colors from "@/constants/Colors";

// Define the type for the availability slot
interface AvailabilitySlot {
  start_time: string;
  finish_time: string;
  available_duration: number;
}

export default function DentistAvailability() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { dentistID } = useUserContext();

  const fetchAvailability = useCallback(async () => {
    try {
      const info = (await getDentistAvailability(dentistID)) as { availability: AvailabilitySlot[] };
      if (info?.availability != null) {
        console.log("Availability");
        console.log(info.availability);
        setAvailability(info.availability);
        setError(null);
      }
      setIsLoaded(true);
    } catch (err) {
      setError((err as Error).message);
      setIsLoaded(true);
    }
  }, [dentistID]);

  useFocusEffect(
    useCallback(() => {
      if (availability.length === 0 && !isLoaded) {
        fetchAvailability();
      }

      availability.map((slot, index) => {
        console.log(slot);
        console.log(index);
      });
    }, [fetchAvailability, availability, isLoaded]),
  );

  useEffect(() => {
    fetchAvailability();
  }, [dentistID, fetchAvailability]);

  if (error) {
    console.log("ERROR: " + error);
    return <></>;
  }

  if (!isLoaded) {
    return <></>;
  }

  if (availability.length === 0) {
    return <></>;
  }

  return (
    <Card lightColor={Colors.tint} darkColor={Colors.tint} style={styles.bottomMargin}>
      <Title lightColor={Colors.dark.text} darkColor={Colors.dark.text} style={{ textAlign: "left", marginBottom: 10 }}>
        {"Availability Slots"}
      </Title>
      <ScrollView horizontal>
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text} fontWeight="800">
              {"Date"}
            </Text>
            <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text} fontWeight="800">
              {"Start Time"}
            </Text>
            <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text} fontWeight="800">
              {"Finish Time"}
            </Text>
            <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text} fontWeight="800">
              {"Duration (mins)"}
            </Text>
          </View>
          {availability.map((slot, index) => {
            const startDate = new Date(slot.start_time);
            const finishDate = new Date(slot.finish_time);
            const date = startDate.toLocaleDateString();
            const startTime = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const finishTime = finishDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
                  {date}
                </Text>
                <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
                  {startTime}
                </Text>
                <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
                  {finishTime}
                </Text>
                <Text style={{ width: 100 }} lightColor={Colors.dark.text} darkColor={Colors.dark.text}>
                  {slot.available_duration}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
}
