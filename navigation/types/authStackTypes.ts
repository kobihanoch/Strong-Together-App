export type AuthRootParamList = {
  Intro: undefined;
  Login: { needToVerify: boolean; email: string | null; password_: string | null; username_: string | null };
  Register: undefined;
};
