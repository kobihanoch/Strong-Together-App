// This file conatins the choice between production and development environment,
//  to know to which server the requests will be sent
// The server needs to be running in the background
// If running on LOCALHOST then DEVLOPMENT server will be used
// If running on PRODUCTION then PRODUCTION server will be used

// Uncomment by production or dev environment

const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIROMENT;

/*export const API_BASE_URL =
  ENVIRONMENT === "development"
    ? process.env.EXPO_PUBLIC_DEV_API
    : process.env.EXPO_PUBLIC_API_URL;*/

export const API_BASE_URL =
  ENVIRONMENT !== "development"
    ? process.env.EXPO_PUBLIC_DEV_API
    : process.env.EXPO_PUBLIC_API_URL;
