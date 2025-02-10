import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log("Successfully saved key to storage");
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
};

export const loadFromStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log("Successfully loaded key from storage");

    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
    return null;
  }
};
