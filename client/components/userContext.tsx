import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import { deleteToken, getToken } from "@/services/tokenStorage";
import { checkUserStatus } from "@/services/authService";
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
  impressionJudgment: ImpressionJudgment;
  user: User | null;
  login: (userData: User) => void;
  tentativeLogin: (userData: User) => void;
  logout: () => void;
  nextStage: () => void;
}

// Create the context with an initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState<Status>("loggedOut");
  const [impressionJudgment, setImpressionJudgment] = useState<ImpressionJudgment>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    const token = await getToken();
    let response;
    if (token) {
      response = await checkUserStatus(userData.email, token);
    }
    if (response?.userData != null) {
      const userDataWithStage = response.userData as { stage: string };
      if (userDataWithStage.stage == "aligner") {
        setStatus("alignerStage");
      }
      if (userDataWithStage.stage == "impression") {
        setStatus("impressionStage");
      }
    } else {
      console.log(response);
    }
  };

  const tentativeLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(false);
    console.log("Just tentatively logged in: " + user?.email);
  };

  const nextStage = () => {
    setIsLoggedIn(true);
    if (status == "impressionStage") {
      console.log("Moving from impressions stage to aligner stage");
      setStatus("alignerStage");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    deleteToken();
    setStatus("loggedOut");
  };

  return <UserContext.Provider value={{ isLoggedIn, user, status, impressionJudgment, login, logout, nextStage, tentativeLogin }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
