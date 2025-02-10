import axios from "axios";
import { getToken, storeToken } from "./tokenStorage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const JARVIS_BASE_URL = process.env.EXPO_PUBLIC_JARVIS_URL;
const JARVIS_API_KEY = process.env.EXPO_PUBLIC_JARVIS_API_KEY;

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
  dentistData?: object;
  availability?: object;
}

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

    login(email);

    for (let key in response.data) {
      if (response.data.hasOwnProperty(key)) {
        console.log(key + ": " + response.data[key]);
      }
    }

    return { message: response.data.message, token: response.data.token, status: response.status };
  } catch (error) {
    const status = error?.response?.status;
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

export const getCustomerDataJarvis = async (apiKey: string, email: string, oauthToken: string): Promise<any> => {
  try {
    console.log(apiKey);
    console.log(email);

    const url = `${JARVIS_BASE_URL}/smilewhite_app/customer/${email}/`;

    console.log(url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Api-Key ${apiKey}`,
        "X-Cognito-Token": oauthToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
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

interface PatchResponse {
  // Define the structure of the response if needed
}

export const signMedicalWaiver = async (email: string, oauthToken: string): Promise<PatchResponse | null> => {
  try {
    if (!JARVIS_BASE_URL || !JARVIS_API_KEY) {
      throw new Error("Missing environment variables for BASE_URL or JARVIS_AUTH_TOKEN");
    }

    console.log("Updating terms accepted for user: ", email);

    const requestURL = `${JARVIS_BASE_URL}/smilewhite_app/customer/${email}/`;

    console.log("URL: ", JARVIS_BASE_URL);

    const payload = {
      terms_accepted: true,
    };

    const response = await axios.patch(requestURL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${JARVIS_API_KEY}`,
        "X-Cognito-Token": oauthToken,
      },
    });

    if (response.status === 200 || response.status === 204) {
      console.log("Successfully updated terms_accepted for user:", email);
      return response.data;
    } else {
      console.error("Jarvis responded with a status code:", response.status);
      throw new Error(`Jarvis responded with a status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error signing medical waiver:", error);
    throw error;
  }
};

export const getDentistInfo = async (dentistid: number, apiKey: string, oauthToken: string): Promise<ResponseMessage | null> => {
  try {
    const url = `${JARVIS_BASE_URL}/smilewhite_app/dentist/${dentistid}/`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Api-Key ${apiKey}`,
        "X-Cognito-Token": oauthToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting dentist info:", error);
    throw error;
  }
};

export const getDentistAvailability = async (dentistid: number): Promise<ResponseMessage | null> => {
  try {
    const token = await getToken();

    const response = await authService.get(`/api/v1/dentist/${dentistid}/availability`, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      },
    });

    return { message: response.data.message, token: response.data.token, status: response.status, availability: response.data.availability };
  } catch (error) {
    console.error("Error getting dentist availability:", error);
    throw error;
  }
};
