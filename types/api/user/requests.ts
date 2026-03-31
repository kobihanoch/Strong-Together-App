export type UpdateUserBody = {
  username?: string | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
};

export type SaveUserPushTokenBody = {
  token: string;
};

export type DeleteUserProfilePicBody = {
  path: string;
};
