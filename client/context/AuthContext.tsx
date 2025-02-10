import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from "react";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, exchangeCodeAsync, revokeAsync, ResponseType, makeRedirectUri } from "expo-auth-session";
import { Alert } from "react-native";
import jwtDecode from "jwt-decode";
import Cognito from "@/constants/Cognito";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  authTokens: any;
  promptAsync: () => void;
  logout: () => void;
  getEmailFromToken: () => string | null;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const clientId = Cognito.clientID;
  const clientSecret = Cognito.clientSecret;
  const userPoolUrl = `https://${Cognito.userPoolID}.auth.${Cognito.region}.amazoncognito.com`;

  const redirectUri = Constants.executionEnvironment === "storeClient" ? "exp://localhost:8081" : makeRedirectUri({ scheme: "smilewhite", path: "oauthredirect" });

  const discoveryDocument = useMemo(
    () => ({
      authorizationEndpoint: `${userPoolUrl}/oauth2/authorize`,
      tokenEndpoint: `${userPoolUrl}/oauth2/token`,
      revocationEndpoint: `${userPoolUrl}/oauth2/revoke`,
    }),
    [userPoolUrl],
  );

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
    },
    discoveryDocument,
  );

  useEffect(() => {
    const exchangeFn = async (exchangeTokenReq) => {
      try {
        const exchangeTokenResponse = await exchangeCodeAsync(
          {
            ...exchangeTokenReq,
            clientSecret,
          },
          discoveryDocument,
        );
        setAuthTokens(exchangeTokenResponse);
      } catch (error) {
        console.error("Token exchange error:", error);
        Alert.alert("Authentication error", "Failed to exchange token. Please try again.");
      }
    };

    if (response) {
      if (response.error) {
        Alert.alert("Authentication error", response.params.error_description || "Something went wrong");
        return;
      }
      if (response.type === "success") {
        exchangeFn({
          clientId,
          code: response.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        });
      }
    }
  }, [response, discoveryDocument, request]);

  const logout = async () => {
    if (authTokens?.refreshToken) {
      try {
        const revokeResponse = await revokeAsync(
          {
            clientId,
            token: authTokens.refreshToken,
            clientSecret,
          },
          discoveryDocument,
        );

        // Log the response for debugging purposes
        console.log("Revoke response:");
        console.log(revokeResponse);

        // Check if the response is valid and handle it accordingly
        if (revokeResponse.status === 200) {
          setAuthTokens(null);
        } else {
          console.error("Logout error: Invalid response", revokeResponse);
          Alert.alert("Logout error", "Failed to log out. Please try again.");
        }
      } catch (error) {
        console.error("Logout error:", error);
        Alert.alert("Logout error", "Failed to log out. Please try again.");
      }
    } else {
      setAuthTokens(null);
    }
  };

  const clearToken = async () => {
    setAuthTokens(null);
  };

  return <AuthContext.Provider value={{ authTokens, promptAsync, logout, clearToken }}>{children}</AuthContext.Provider>;
};

// Custom hook to use the UserContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
