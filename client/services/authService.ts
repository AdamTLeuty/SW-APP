// services/hubspotService.ts

import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
console.log(BASE_URL);

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
  token: string;
  status: number;
}

export const registerNewUser = async (email: string, password: string, register: (userData: { name: string; email: string }) => void): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/register`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const mockUserData = { name: "John Doe", email: email };
    //console.log("Before the login state call");
    register(mockUserData);

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        // Ensure it is the object's own property
        //console.log(key + ": " + response.data[key]);
      }
    }

    console.log("Response Message: " + response.data.message);

    return { message: response.data.message, token: response.data.token, status: response.status };

    //Object.keys(response.data.properties).length > 0 ? response.data.properties : null;
    //return response.data.properties;
  } catch (error) {
    console.error("Error fetching user data from auth server:", error);
    throw error;
  }
};

export const loginExistingUser = async (email: string, password: string, login: (userData: { name: string; email: string }) => void): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const mockUserData = { name: "John Doe", email: email };
    //console.log("Before the login state call");
    login(mockUserData);
    //console.log("After the login state call");

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    return { message: response.data.message, token: response.data.token };
  } catch (error) {
    console.error("Error fetching user data from auth server:", error);
    throw error;
  }
};

export const loginExistingUserWithToken = async (token: string, login: (userData: { name: string; email: string }) => void): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/loginWithToken`,
      {
        token: token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    const userEmail = response.data.message.email;

    const mockUserData = { name: "John Doe", email: userEmail };
    login(mockUserData);

    return { message: response.data.message, token: response.data.token, status: response.status };
  } catch (error) {
    console.error("Error fetching user data from auth server:", error);
    throw error;
  }
};

export const verifyEmail = async (email: string, authcode: string, login: (userData: { name: string; email: string }) => void): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/verifyEmail`,
      {
        email: email,
        authcode: authcode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const mockUserData = { name: "John Doe", email: email };
    login(mockUserData);

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    return { message: response.data.message, token: response.data.token, status: response.status };
  } catch (error) {
    console.error("Error fetching user data from auth server:", error);
    throw error;
  }
};
