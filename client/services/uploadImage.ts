import axios from "axios";
import FormData from "form-data";
import { Status, useUserContext } from "@/components/userContext";
import { getToken } from "./tokenStorage";

interface ResponseMessage {
  message: string;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const authService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadImage = async (uri: string, status: Status): Promise<ResponseMessage | null> => {
  try {
    const formData = new FormData();
    //const { status } = useUserContext();

    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    formData.append("file", {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    const today = new Date();
    const date = today.toISOString().split("T")[0];

    const jsonData = JSON.stringify({
      date: date,
      type: status == "impressionStage" ? "impression" : "progress",
    });
    formData.append("json", jsonData);

    const token = await getToken();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await authService.post(`/api/uploadImage`, formData, config);

    console.log("Response Message: " + response.data.message);

    return { message: response.data.message };
  } catch (error) {
    console.error("Error sending file to server:", error);
    throw error;
  }
};
