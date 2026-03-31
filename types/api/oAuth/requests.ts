export type GoogleOAuthBody = {
  idToken?: string | undefined;
};

export type AppleOAuthBody = {
  email: string | null;
  idToken: string | undefined;
  rawNonce: string | undefined;
  name:
    | {
        givenName: string | null;
        familyName: string | null;
      }
    | null
    | undefined;
};
