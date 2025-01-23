import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest, exchangeCodeAsync, revokeAsync, ResponseType } from "expo-auth-session";
import { Alert } from "react-native";
import Cognito from "@/constants/Cognito";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const clientId = Cognito.clientID;
  const userPoolUrl = `https://${Cognito.userPoolID}.auth.${Cognito.region}.amazoncognito.com`;
  console.log(userPoolUrl);
  const redirectUri = Cognito.redirectURL;

  const discoveryDocument = useMemo(
    () => ({
      authorizationEndpoint: userPoolUrl + "/oauth2/authorize",
      tokenEndpoint: userPoolUrl + "/oauth2/token",
      revocationEndpoint: userPoolUrl + "/oauth2/revoke",
    }),
    [],
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
        const exchangeTokenResponse = await exchangeCodeAsync(exchangeTokenReq, discoveryDocument);
        setAuthTokens(exchangeTokenResponse);
      } catch (error) {
        console.error(error);
      }
    };
    if (response) {
      if (response.error) {
        Alert.alert("Authentication error", response.params.error_description || "something went wrong");
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
  }, [discoveryDocument, request, response]);

  const logout = async () => {
    const revokeResponse = await revokeAsync(
      {
        clientId: clientId,
        token: authTokens.refreshToken,
      },
      discoveryDocument,
    );
    if (revokeResponse) {
      setAuthTokens(null);
    }
  };

  return <AuthContext.Provider value={{ authTokens, promptAsync, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
