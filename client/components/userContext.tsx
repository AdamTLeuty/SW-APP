import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import { deleteToken, getToken } from "@/services/tokenStorage";
import { checkUserStatus, setUserStatus, getCustomerDataJarvis } from "@/services/authService";
// Define the types for the context state and functions
interface User {
  name: string;
  email: string;
}

interface JarvisData {
  assigned_dentist: number;
  id: number;
  last_name: string;
  name: string;
  terms_accepted: boolean;
  terms_links: string;
}

export type Status = "loggedOut" | "impressionStage" | "alignerStage";
type ImpressionJudgment = null | "good" | "bad";

interface UserContextType {
  isLoggedIn: boolean;
  status: Status;

  impressionJudgment: ImpressionJudgment;
  user: User | null;
  login: (userData: User) => Promise<void>;
  updateUserContext: () => Promise<void>;
  tentativeLogin: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  nextStage: () => Promise<void>;
  alignerCount: number;
  alignerProgress: number;
  alignerChangeDate: string;
  expoPushToken: string;
  updateExpoPushToken: (expoToken: string) => Promise<void>;
  updateAlignerCount: (count: number) => Promise<void>;
  updateAlignerProgress: (count: number) => Promise<void>;
  updateUsername: (name: string) => Promise<void>;
  medicalWaiverSigned: boolean;
  dentistID: number;
  oauthToken: string;
  updateOauthToken: (token: string) => Promise<void>;
}

// Create the context with an initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState<Status>("loggedOut");
  const [impressionJudgment, setImpressionJudgment] = useState<ImpressionJudgment>(null);
  const [user, setUser] = useState<User | null>(null);
  const [alignerCount, setAlignerCount] = useState<number>(0);
  const [alignerProgress, setAlignerProgress] = useState<number>(0);
  const [alignerChangeDate, setAlignerChangeDate] = useState<string>("");
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [medicalWaiverSigned, setMedicalWaiverSigned] = useState<boolean>(false);
  const [dentistID, setDentistID] = useState<number>(-1);
  const [oauthToken, setOauthtoken] = useState<string>("");

  const login = async (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    await updateUserContext();
  };

  const updateUserContext = async () => {
    const token = await getToken();
    let response;
    let responseJarvis;
    let jarvisData;
    const apiKey = process.env.EXPO_PUBLIC_JARVIS_API_KEY;
    if (token) {
      response = await checkUserStatus(user.email, token);
      responseJarvis = await getCustomerDataJarvis(apiKey, user.email);
    }
    if (responseJarvis != null) {
      jarvisData = responseJarvis as JarvisData;

      if (jarvisData.name != null && jarvisData?.last_name != null) {
        let newUser = user;
        newUser.name = jarvisData.name + "\u00A0" + jarvisData.last_name;
        setUser(newUser);
      }

      if (jarvisData.assigned_dentist != null) {
        setDentistID(jarvisData.assigned_dentist);
      }

      if (jarvisData.terms_accepted != null) {
        setMedicalWaiverSigned(jarvisData.terms_accepted);
      }
    }
    if (response?.userData != null) {
      const userDataWithStage = response.userData as {
        username: string;
        stage: string;
        alignerCount: number;
        alignerProgress: number;
        alignerChangeDate: string;
        medicalWaiverSigned: boolean;
        dentistID: number;
      };

      if (userDataWithStage.stage == "impression") {
        setStatus("impressionStage");
      }
      if (userDataWithStage.stage == "aligner") {
        setStatus("alignerStage");
      }

      if (userDataWithStage.alignerCount) {
        setAlignerCount(userDataWithStage.alignerCount);
      }
      if (userDataWithStage.alignerProgress != null) {
        setAlignerProgress(userDataWithStage.alignerProgress);
      }
      if (userDataWithStage.alignerChangeDate) {
        setAlignerChangeDate(userDataWithStage.alignerChangeDate);
      }
    }
    return;
  };

  const tentativeLogin = async (userData: User) => {
    setUser(userData);
    setIsLoggedIn(false);
  };

  const nextStage = async () => {
    setIsLoggedIn(true);
    if (status == "impressionStage") {
      setStatus("alignerStage");
    }
    const token = await getToken();
    if (!token) {
      console.error("Token is empty");
      return;
    }
    setUserStatus(token, { stage: "aligner" });
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    deleteToken();
    setStatus("loggedOut");
  };

  const updateExpoPushToken = async (expoToken: string) => {
    const userToken = await getToken();
    if (!userToken) {
      console.error("Token is empty");
      return;
    }
    if (expoToken != "" && expoToken != expoPushToken) {
      setExpoPushToken(expoToken);
      setUserStatus(userToken, { expoPushToken: expoToken });
    }
  };

  const updateUsername = async (name: string) => {
    if (name.length <= 0 || name.length > 36) {
    } else {
      if (user) {
        user.name = name;
      }
    }

    const token = await getToken();
    if (!token) {
      console.error("Token is empty");
      return;
    }
    setUserStatus(token, { username: name });

    return;
  };

  const updateAlignerProgress = async (count: number) => {
    if (count <= 0) {
    } else {
      setAlignerCount(count);
    }

    const token = await getToken();
    if (!token) {
      console.error("Token is empty");
      return;
    }
    setUserStatus(token, { aligner_count: count });

    return;
  };

  const updateAlignerCount = async (count: number) => {
    await updateUserContext();

    if (alignerCount == 0) {
      if (count < 0) {
      } else {
        setAlignerCount(count);
      }
    }
    const token = await getToken();
    if (!token) {
      console.error("Token is empty");
      return;
    }
    setUserStatus(token, { aligner_count: count });

    return;
  };

  const updateOauthToken = async (token: string) => {
    const userToken = await getToken();
    if (!userToken) {
      console.error("Token is empty");
      return;
    }
    if (token != "" && token != oauthToken) {
      setOauthtoken(token);
      setUserStatus(userToken, { oauthToken: token });
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        status,
        impressionJudgment,
        login,
        logout,
        updateUserContext,
        nextStage,
        tentativeLogin,
        alignerCount,
        alignerProgress,
        alignerChangeDate,
        expoPushToken,
        updateExpoPushToken,
        updateAlignerCount,
        updateAlignerProgress,
        updateUsername,
        medicalWaiverSigned,
        dentistID,
        oauthToken,
        updateOauthToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
