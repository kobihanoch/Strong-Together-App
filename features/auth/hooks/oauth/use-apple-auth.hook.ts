import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { loginUserApple } from '../../services/oauth.service';

/**
 * Builds the native Apple authorization flow, including nonce hashing and the
 * backend identity-token exchange. The action rejects on unsupported platforms,
 * cancellation, missing credentials, or exchange failure.
 *
 * @returns A stable `signInWithApple` action resolving to the backend login response.
 */
export function useAppleAuth() {
  const signInWithApple = useCallback(async () => {
    try {
      if (Platform.OS !== 'ios') {
        throw { ok: false, message: 'Apple Sign-In is available only on iOS' };
      }

      // Create nonce and hash it
      const rawNonce = Math.random().toString(36).slice(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);

      // Ask Apple
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
        nonce: hashedNonce,
      });

      if (!result?.identityToken) {
        throw { ok: false, message: 'Canceled or missing identityToken' };
      }

      // Call backend (axios interceptor will add dpop-key-binding)
      const data = await loginUserApple(result.identityToken, rawNonce, result.email || null, {
        givenName: result.fullName?.givenName ?? null,
        familyName: result.fullName?.familyName ?? null,
      });

      return data;
    } catch (e) {
      console.log((e as Error).message);
      throw new Error('Unexpected error during Apple sign-in');
    }
  }, []);

  return { signInWithApple };
}
