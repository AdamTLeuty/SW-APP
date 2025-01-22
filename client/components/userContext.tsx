import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import { deleteToken, getToken } from "@/services/tokenStorage";
import { checkUserStatus, setUserStatus } from "@/services/authService";
// Define the types for the context state and functions
interface User {
  name: string;
  email: string;
}

export type Status = "loggedOut" | "impressionStage" | "alignerStage";
type ImpressionJudgment = null | "good" | "bad";

interface UserContextType {
  isLoggedIn: boolean;
  status: Status;
  canChangeStage: Boolean;
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
  impressionConfirmation: string;
  medicalWaiverSigned: boolean;
  dentistID: number;
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
  const [impressionConfirmation, setImpressionConfirmation] = useState<string>("unset");
  const [canChangeStage, setCanChangeStage] = useState<Boolean>(false);
  const [medicalWaiverSigned, setMedicalWaiverSigned] = useState<boolean>(false);
  const [dentistID, setDentistID] = useState<number>(-1);

  const login = async (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    await updateUserContext();
  };

  const updateUserContext = async () => {
    console.log("Should send a request to the server");
    const token = await getToken();
    let response;
    if (token) {
      response = await checkUserStatus(user.email, token);
    }
    if (response?.userData != null) {
      const userDataWithStage = response.userData as {
        username: string;
        stage: string;
        alignerCount: number;
        alignerProgress: number;
        alignerChangeDate: string;
        canChangeStage: Boolean;
        impressionConfirmation: string;
        medicalWaiverSigned: boolean;
        dentistID: number;
      };
      console.log("stage: " + userDataWithStage.stage);

      console.log("The username fetched from the server is: " + userDataWithStage.username);
      console.log("Can we set the username?: ");
      console.log(userDataWithStage.username && user != null);

      if (userDataWithStage.username && user != null) {
        console.log(user);
        let newUser = user;

        newUser.name = userDataWithStage.username;
        console.log(newUser);
        setUser(newUser);
      }
      if (userDataWithStage.canChangeStage) {
        setCanChangeStage(true);
      }
      if (userDataWithStage.stage == "impression") {
        setStatus("impressionStage");
      }
      if (userDataWithStage.stage == "aligner") {
        setStatus("alignerStage");
      }
      console.log(userDataWithStage);
      if (userDataWithStage.alignerCount) {
        setAlignerCount(userDataWithStage.alignerCount);
      }
      if (userDataWithStage.dentistID) {
        setDentistID(Number(userDataWithStage.dentistID));
      }
      if (userDataWithStage.alignerProgress != null) {
        setAlignerProgress(userDataWithStage.alignerProgress);
      }
      if (userDataWithStage.alignerChangeDate) {
        setAlignerChangeDate(userDataWithStage.alignerChangeDate);
      }
      if (userDataWithStage.impressionConfirmation) {
        setImpressionConfirmation(userDataWithStage.impressionConfirmation);
      }
      if (userDataWithStage.medicalWaiverSigned != null) {
        setMedicalWaiverSigned(userDataWithStage.medicalWaiverSigned);
      }
    } else {
      console.log(response);
    }
    return;
  };

  const tentativeLogin = async (userData: User) => {
    console.log(userData);
    setUser(userData);
    setIsLoggedIn(false);
    console.log("User data is:" + user);
    console.log("Just tentatively logged in: " + userData.email);
  };

  const nextStage = async () => {
    setIsLoggedIn(true);
    if (status == "impressionStage") {
      console.log("Moving from impressions stage to aligner stage");
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
    console.log("Setting Expo Push Token as: ", expoToken);
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
      console.log("Not an acceptable answer");
    } else {
      console.log("Set the username");
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
      console.log("Not an acceptable answer");
    } else {
      console.log("Set the aligner count");
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
        console.log("Not an acceptable answer");
      } else {
        console.log("Set the aligner count");
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
        canChangeStage,
        impressionConfirmation,
        medicalWaiverSigned,
        dentistID,
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
