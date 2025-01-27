import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, exchangeCodeAsync, revokeAsync, ResponseType, makeRedirectUri } from "expo-auth-session";
import { Alert } from "react-native";
import Cognito from "@/constants/Cognito";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const clientId = Cognito.clientID;
  const userPoolUrl = `https://${Cognito.userPoolID}.auth.${Cognito.region}.amazoncognito.com`;

  const redirectUri =
    Constants.executionEnvironment === "storeClient" ? "exp://localhost:8081" /*makeRedirectUri({ useProxy: true })*/ : makeRedirectUri({ scheme: "smilewhite", path: "oauthredirect" });

  console.log("Redirect uri: " + redirectUri);
  console.log(makeRedirectUri({ scheme: "smilewhite", path: "oauthredirect" }));

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

  console.log(request);

  useEffect(() => {
    const exchangeFn = async (exchangeTokenReq) => {
      try {
        const exchangeTokenResponse = await exchangeCodeAsync(exchangeTokenReq, discoveryDocument);
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
        await revokeAsync(
          {
            clientId,
            token: authTokens.refreshToken,
          },
          discoveryDocument,
        );
        setAuthTokens(null);
      } catch (error) {
        console.error("Logout error:", error);
        Alert.alert("Logout error", "Failed to log out. Please try again.");
      }
    } else {
      setAuthTokens(null);
    }
  };

  return <AuthContext.Provider value={{ authTokens, promptAsync, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
