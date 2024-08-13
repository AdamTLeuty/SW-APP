import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "expo-router";
import { deleteToken } from "@/services/tokenStorage";

// Define the types for the context state and functions
interface Image {
  uri: string;
}

interface CurrentImageContextType {
  hasCurrentImage: boolean;
  image: Image | null;
  newImage: (imageData: Image) => void;
  clearImage: () => void;
}

// Create the context with an initial value
const CurrentImageContext = createContext<CurrentImageContextType | undefined>(undefined);

// Create a provider component
export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [hasCurrentImage, setHasCurrentImage] = useState(false);
  const [image, setImage] = useState<Image | null>(null);

  const newImage = (imageData: Image) => {
    setHasCurrentImage(true);
    setImage(imageData);
  };

  const clearImage = () => {
    setHasCurrentImage(false);
    setImage(null);
  };

  return <CurrentImageContext.Provider value={{ hasCurrentImage, image, newImage, clearImage }}>{children}</CurrentImageContext.Provider>;
};

// Custom hook to use the CurrentImageContext
export const useCurrentImageContext = () => {
  const context = useContext(CurrentImageContext);
  if (!context) {
    throw new Error("useCurrentImageContext must be used within a ImageProvider");
  }
  return context;
};
