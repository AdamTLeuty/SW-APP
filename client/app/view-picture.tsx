import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ModalScreen() {
  const { date } = useLocalSearchParams();

  return (
    <View>
      <Text>Date: {date}</Text>
    </View>
  );
}
