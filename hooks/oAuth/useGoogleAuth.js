// useGoogleAuth.js
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useCallback, useMemo } from "react";
import api from "../../api/api";

WebBrowser.maybeCompleteAuthSession();

// Static Google OAuth discovery (Auth, Token, Revoke endpoints)
const googleDiscovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export function useGoogleAuth() {
  // Keep your existing config as-is
  const config = useMemo(
    () => ({
      iosClientId:
        process.env.EXPO_PUBLIC_ENVIRONMENT === "development"
          ? "251052469921-m94nh37mk2tpeda5ft32p5k6sbll46ad.apps.googleusercontent.com"
          : "251052469921-49q99ipshcsktkt3v6hemmrdjbec8oo8.apps.googleusercontent.com",
      scopes: ["openid", "email", "profile"],
      responseType: "code", // using Authorization Code + PKCE
      redirectUri:
        process.env.EXPO_PUBLIC_ENVIRONMENT === "development"
          ? "com.googleusercontent.apps.251052469921-m94nh37mk2tpeda5ft32p5k6sbll46ad:/oauthredirect"
          : "com.googleusercontent.apps.251052469921-49q99ipshcsktkt3v6hemmrdjbec8oo8:/oauthredirect",
      prompt: "select_account",
    }),
    []
  );

  // Create request (PKCE code_verifier will be generated here)
  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const signInWithGoogle = useCallback(async () => {
    try {
      if (!request) throw { ok: false, error: "Google Auth not ready" };

      // 1) Launch the Google consent screen
      const res = await promptAsync();
      if (!res || res.type !== "success") {
        throw { ok: false, error: res?.type || "canceled" };
      }

      // 2) Authorization Code flow returns `code` (not id_token)
      const code = res.params?.code;
      if (!code) {
        throw { ok: false, error: "Missing authorization code" };
      }

      // 3) Exchange the code for tokens using PKCE
      //    IMPORTANT: pass the same redirectUri and the request.codeVerifier
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: config.iosClientId, // iOS client ID
          code,
          redirectUri: config.redirectUri,
          // code_verifier proves the app initiated the flow (PKCE)
          extraParams: { code_verifier: request.codeVerifier },
        },
        googleDiscovery
      );

      // tokenResult should include idToken (OIDC), accessToken, etc.
      const idToken = tokenResult?.idToken;
      if (!idToken) {
        throw { ok: false, error: "Token exchange failed: missing id_token" };
      }
      // 4) Continue with your existing backend call (unchanged contract)
      const { data } = await api.post("/api/oauth/google", { idToken });

      return data;
    } catch (e) {
      console.log(e);
      throw new Error("Unexpected error during Google sign-in");
    }
  }, [promptAsync, request, config]);

  return { signInWithGoogle, request, response };
}
