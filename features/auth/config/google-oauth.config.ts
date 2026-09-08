import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

const isDev = process.env.EXPO_PUBLIC_ENVIRONMENT === 'development';

export const googleDiscovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const googleAuthConfig: Google.GoogleAuthRequestConfig = {
  clientId: isDev
    ? '251052469921-m94nh37mk2tpeda5ft32p5k6sbll46ad.apps.googleusercontent.com'
    : '251052469921-49q99ipshcsktkt3v6hemmrdjbec8oo8.apps.googleusercontent.com',
  iosClientId: isDev
    ? '251052469921-m94nh37mk2tpeda5ft32p5k6sbll46ad.apps.googleusercontent.com'
    : '251052469921-49q99ipshcsktkt3v6hemmrdjbec8oo8.apps.googleusercontent.com',
  scopes: ['openid', 'email', 'profile'],
  responseType: 'code',
  redirectUri: isDev
    ? 'com.googleusercontent.apps.251052469921-m94nh37mk2tpeda5ft32p5k6sbll46ad:/oauthredirect'
    : 'com.googleusercontent.apps.251052469921-49q99ipshcsktkt3v6hemmrdjbec8oo8:/oauthredirect',
  prompt: AuthSession.Prompt.SelectAccount,
};
