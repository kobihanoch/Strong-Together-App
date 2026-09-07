import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { googleAuthConfig, googleDiscovery } from '../../config/google-oauth.config';
import { loginUserGoogle } from '../../services/oauth.service';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  // Create request (PKCE code_verifier will be generated here)
  const [request, response, promptAsync] = Google.useAuthRequest(googleAuthConfig);

  const signInWithGoogle = useCallback(async () => {
    try {
      if (!request) throw { ok: false, error: 'Google Auth not ready' };

      // 1) Launch the Google consent screen
      const res = await promptAsync();
      if (!res || res.type !== 'success') {
        throw { ok: false, error: res?.type || 'canceled' };
      }

      // 2) Authorization Code flow returns `code` (not id_token)
      const code = res.params?.code;
      if (!code) {
        throw { ok: false, error: 'Missing authorization code' };
      }

      // 3) Exchange the code for tokens using PKCE
      //    IMPORTANT: pass the same redirectUri and the request.codeVerifier
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: googleAuthConfig.iosClientId!, // iOS client ID
          code,
          redirectUri: googleAuthConfig.redirectUri!,
          // code_verifier proves the app initiated the flow (PKCE)
          extraParams: {
            code_verifier: request.codeVerifier || '',
          },
        },
        googleDiscovery,
      );

      // tokenResult should include idToken (OIDC), accessToken, etc.
      const idToken = tokenResult?.idToken;
      if (!idToken) {
        throw { ok: false, error: 'Token exchange failed: missing id_token' };
      }
      // 4) Continue with your existing backend call (unchanged contract)
      const data = await loginUserGoogle(idToken);
      return data;
    } catch (e) {
      console.log(e);
      throw new Error('Unexpected error during Google sign-in');
    }
  }, [promptAsync, request]);

  return { signInWithGoogle, request, response };
}
