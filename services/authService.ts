// services/hubspotService.ts

import axios from "axios";

const BASE_URL = "https://app-auth.smilewhite.co.uk";

const authService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface HubSpotUser {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    [key: string]: any;
  };
}

interface ResponseMessage {
  message: string;
}

export const registerNewUser = async (): Promise<null> => {
  try {
    const response = await authService.post(
      `/api/register`,
      {
        email: "test2@example.com",
        password: "password1234",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        // Ensure it is the object's own property
        console.log(key + ": " + response.data[key]);
      }
    }
    return null; //Object.keys(response.data.properties).length > 0 ? response.data.properties : null;
    //return response.data.properties;
  } catch (error) {
    console.error("Error fetching user data from HubSpot:", error);
    throw error;
  }
};

export const loginExistingUser = async (): Promise<null> => {
  try {
    const response = await authService.post(
      `/api/login`,
      {
        email: "test2@example.com",
        password: "password1234",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        // Ensure it is the object's own property
        console.log(key + ": " + response.data[key]);
      }
    }
    return null; //Object.keys(response.data.properties).length > 0 ? response.data.properties : null;
    //return response.data.properties;
  } catch (error) {
    console.error("Error fetching user data from HubSpot:", error);
    throw error;
  }
};
