import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import { deleteToken, getToken } from "@/services/tokenStorage";
import { useAuthContext } from "@/context/AuthContext";
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

export type Status = "loggedOut" | "alignerStage";
type ImpressionJudgment = null | "good" | "bad";

interface UserContextType {
  isLoggedIn: boolean;
  status: Status;
  impressionJudgment: ImpressionJudgment;
  user: User | null;
  login: (userData: User) => Promise<void>;
  updateUserContext: (userEmail: string) => Promise<void>;
  tentativeLogin: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
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
  oauthTokens: string;
  setOauthTokens: (token: string) => Promise<void>;
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
  const [medicalWaiverSigned, setMedicalWaiverSigned] = useState<boolean>(true);
  const [dentistID, setDentistID] = useState<number>(-1);
  const [oauthTokens, setOauthTokens] = useState<any>({});

  const login = async (email: string) => {
    setIsLoggedIn(true);
    setStatus("alignerStage");
    await updateUserContext(email);
  };

  const updateUserContext = async (userEmail: string) => {
    const token = await getToken();
    let response;
    let responseJarvis;
    let jarvisData;
    const apiKey = process.env.EXPO_PUBLIC_JARVIS_API_KEY;
    const oauthToken = oauthTokens.token;

    if (token) {
      response = await checkUserStatus(userEmail, token);
      responseJarvis = await getCustomerDataJarvis(apiKey, userEmail, oauthToken);
    }
    if (responseJarvis != null) {
      jarvisData = responseJarvis as JarvisData;

      if (jarvisData.name != null && jarvisData?.last_name != null) {
        let newUser: User = { name: jarvisData.name + "\u00A0" + jarvisData.last_name, email: userEmail };
        setUser(newUser);
      } else {
        let newUser: User = { name: userEmail, email: userEmail };
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
        alignerCount: number;
        alignerProgress: number;
        alignerChangeDate: string;
      };

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

  const logout = async () => {
    const { clearToken } = useAuthContext();
    setIsLoggedIn(false);
    setUser(null);
    deleteToken();
    clearToken();
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
        oauthTokens,
        setOauthTokens,
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
