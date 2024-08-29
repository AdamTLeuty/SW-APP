import axios from "axios";
import FormData from "form-data";
import { Status, useUserContext } from "@/components/userContext";

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

    const jsonData = JSON.stringify({
      email: "test@gmail.com",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRlc3RAZ21haWwuY29tIiwiZXhwIjoxNzIzNjQ4NzY3fQ.UYPtHL7_rp3p_BvCSgqrpx-uaLY5XCBNMp__4FK7fQg",
      date: "2024-08-14",
      type: status == "impressionStage" ? "impression" : "progress",
    });
    formData.append("json", jsonData);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
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
