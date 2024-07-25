import * as SecureStore from "expo-secure-store";

export const storeToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("token", token);
    console.log("Token stored successfully");
  } catch (error) {
    console.log("Could not store the token", error);
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      console.log("Token retrieved:", token);
      return token;
    } else {
      console.log("No token stored");
      return null;
    }
  } catch (error) {
    console.log("Could not retrieve the token", error);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync("token");
    console.log("Token deleted successfully");
  } catch (error) {
    console.log("Could not delete the token", error);
  }
};
