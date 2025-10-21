import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import { useCallback } from "react";
import api from "../../api/api"; // <-- call backend here for symmetry

export function useAppleAuth() {
  const signInWithApple = useCallback(async () => {
    try {
      if (Platform.OS !== "ios") {
        throw { ok: false, message: "Apple Sign-In is available only on iOS" };
      }

      // Create nonce and hash it
      const rawNonce = Math.random().toString(36).slice(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      // Ask Apple
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!result?.identityToken) {
        throw { ok: false, message: "Canceled or missing identityToken" };
      }

      // Call your backend (axios interceptor will add dpop-key-binding)
      const { data } = await api.post("/api/oauth/apple", {
        identityToken: result.identityToken,
        rawNonce,
        email: result.email || null,
        name:
          result.fullName?.givenName ||
          result.fullName?.familyName ||
          "Apple User",
      });

      return data;
    } catch (e) {
      console.log(e.message);
      throw new Error("Unexpected error during Apple sign-in");
    }
  }, []);

  return { signInWithApple };
}
