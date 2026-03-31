
export type LoginRequestBody = {
    identifier: string;
    password: string;
}
export type VerifyUserAccountQuery = {
    token?: string | undefined;
}
export type SendVerifcationMailBody = {
    email: string;
}
export type ChangeEmailAndVerifyBody = {
    username: string;
    password: string;
    newEmail: string;
}
export type CheckUserVerifyQuery = {
    username: string;
}
export type SendChangePassEmailBody = {
    identifier: string;
}
export type ResetPasswordBody = {
    newPassword: string;
}
export type ResetPasswordQuery = {
    token?: string | undefined;
}
export type CreateUserBody = {
    username: string;
    fullName: string;
    email: string;
    password: string;
    gender: "Male" | "Female" | "Other" | "Unknown";
}
