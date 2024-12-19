// services/hubspotService.ts

import axios from "axios";
import { getToken, storeToken } from "./tokenStorage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const authService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
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
  userData?: object;
}

export const registerNewUser = async (
  username: string,
  email: string,
  password: string,
  tentativeLogin: (userData: { name: string; email: string }) => void,
): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/v1/register`,
      {
        username: username,
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    );

    await storeToken(response.data.token);

    const mockUserData = { name: username, email: email };
    //console.log("Before the login state call");
    tentativeLogin(mockUserData);

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
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginExistingUser = async (
  email: string,
  password: string,
  login: (userData: { name: string; email: string }) => void,
  tentativeLogin: (userData: { name: string; email: string }) => void,
): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/v1/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    );

    await storeToken(response.data.token);

    const userData = await checkUserStatus(email, response.data.token);
    const userDataDeconstructed = userData?.userData as { username: string };
    const name = userDataDeconstructed.username;

    const mockUserData = { name: name, email: email };
    //console.log("Before the login state call");
    login(mockUserData);
    //console.log("After the login state call");

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    return { message: response.data.message, token: response.data.token, status: response.status };
  } catch (error) {
    const status = error?.response?.status;
    if (status == 403) {
      const mockUserData = { name: "", email: email };
      console.log("about to call `tentativeLogin` with this email" + email);
      tentativeLogin(mockUserData);
    }
    throw error;
  }
};

export const loginExistingUserWithToken = async (
  token: string,
  login: (userData: { name: string; email: string }) => void,
  tentativeLogin: (userData: { name: string; email: string }) => void,
): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/v1/loginWithToken`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await storeToken(response.data.token);

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    const userEmail = response.data.message.email;
    const userData = await checkUserStatus(userEmail, response.data.token);
    const userDataDeconstructed = userData?.userData as { username: string };
    const name = userDataDeconstructed.username;

    const mockUserData = { name: name, email: userEmail };
    login(mockUserData);

    return { message: response.data.message, token: response.data.token, status: response.status };
  } catch (error) {
    const status = error?.response?.status;
    const email = error?.response?.data?.email;
    console.log("Error status is " + status);
    console.log("Error email is " + email);
    if (status == 403) {
      const mockUserData = { name: "John Doe", email: email };
      tentativeLogin(mockUserData);
    }
    console.log("The error at this point is:" + error);
    throw error;
  }
};

export const verifyEmail = async (email: string, authcode: string, login: (userData: { name: string; email: string }) => void): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/v1/verifyEmail`,
      {
        email: email,
        authcode: authcode,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    );

    await storeToken(response.data.token);

    const mockUserData = { name: "John Doe", email: email };
    login(mockUserData);

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    return { message: response.data.message, token: response.data.token, status: response.status };
  } catch (error) {
    console.error("Error verifying user email:", error);
    throw error;
  }
};

export const requestNewAuthCode = async (email: string): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(
      `/api/v1/resendVerifyEmail`,
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    );

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    return { message: response.data.message, token: response.data.token, status: response.status };
  } catch (error) {
    console.error("Error requesting new auth code:", error);
    throw error;
  }
};

export const checkUserStatus = async (email: string, token: string): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.get(`/api/v1/userData`, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      },
    });

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    console.log(response.data.userData);

    console.log("stage inside: " + response.data.userData.stage);

    return { message: response.data.message, token: response.data.token, status: response.status, userData: response.data.userData };
  } catch (error) {
    console.error("Error fetching user data from auth server:", error);
    throw error;
  }
};

export const setUserStatus = async (token: string, userDataToChange: object): Promise<ResponseMessage | null> => {
  try {
    const response = await authService.post(`/api/v1/userData`, userDataToChange, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      },
    });

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    console.log(response.data.userData);

    return { message: response.data.message, token: response.data.token, status: response.status, userData: response.data.userData };
  } catch (error) {
    console.error("Error fetching user data from auth server:", error);
    throw error;
  }
};

export const updateAlignerChangeDate = async (delay: boolean): Promise<ResponseMessage | null> => {
  try {
    const token = await getToken();

    const response = await authService.post(
      "/api/v1/changeAlignerDate",
      {
        delayChange: delay,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { message: response.data.message, token: response.data.token, status: response.status, userData: response.data.userData };
  } catch (error) {
    console.error("Error updating `alignerChangeDate`:", error);
    throw error;
  }
};

export const sign_medical_waiver = async (): Promise<ResponseMessage | null> => {
  try {
    const token = await getToken();

    console.log(token);

    const response = await authService.put(
      "/api/v1/signWaiver",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { message: response.data.message, token: response.data.token, status: response.status, userData: response.data.userData };
  } catch (error) {
    console.error("Error signing medical waiver`:", error);
    throw error;
  }
};
