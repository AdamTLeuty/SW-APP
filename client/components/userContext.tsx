import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import { deleteToken } from "@/services/tokenStorage";

// Define the types for the context state and functions
interface User {
  name: string;
  email: string;
}

interface UserContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with an initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    deleteToken();
  };

  return <UserContext.Provider value={{ isLoggedIn, user, login, logout }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
