export type GoogleOAuthBody = {
  idToken?: string | undefined;
};

export type AppleOAuthBody = {
  email: string;
  idToken?: string | undefined;
  rawNonce?: string | undefined;
  name?:
    | {
        givenName?: string | undefined;
        familyName?: string | undefined;
      }
    | null
    | undefined;
};
