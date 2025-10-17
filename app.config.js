// app.config.js

// Base name and identifier for the production app
const APP_NAME_BASE = "Strong Together";
const BUNDLE_ID_BASE = "com.kobihanoch.strongtogether";

// Retrieve the current build profile (defaults to 'development' if not set, e.g., when running 'expo start')
const buildProfile = process.env.EAS_BUILD_PROFILE || 'development';

const config = ({ config }) => {
  // Start with the base configuration from your original app.json
  const newConfig = {
    ...config,
    name: APP_NAME_BASE,
    slug: "strong-together",
    version: "4.1.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#2979ff",
    },
    notification: {
      icon: "./assets/icon.png",
      color: "#FFFFFF",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      ["expo-notifications", { mode: "production" }],
      "expo-localization",
      "expo-font",
    ],
    extra: {
      eas: {
        projectId: "c2039946-58ec-44b1-beb0-cb0a69f01873",
      },
      // Ensure these remain here if they are pulled from environment variables
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseEdgeUrl: process.env.SUPABASE_EDGE_URL,
      supabaseRef: process.env.SUPABASE_REF,
    },
    // iOS base settings
    ios: {
      supportsTablet: false,
      bundleIdentifier: BUNDLE_ID_BASE, // Default: Production ID
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSPhotoLibraryUsageDescription:
          "We use your photo library so you can select a profile picture for your account.",
      },
    },
    // Android base settings
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#2979ff",
      },
      package: BUNDLE_ID_BASE, // Default: Production ID
    }
  };

  // -----------------------------------------------------------------
  // |                Specific Adjustments for Development (DEV) Build              |
  // -----------------------------------------------------------------

  if (buildProfile === 'development') {
    const DEV_SUFFIX = " (Dev)";
    const DEV_BUNDLE_SUFFIX = ".dev";

    // 1. Change App Name: "Strong Together (Dev)"
    // This allows the Dev Client to be easily distinguished on the home screen.
    newConfig.name = APP_NAME_BASE + DEV_SUFFIX;

    // 2. Change iOS Bundle Identifier: "com.kobihanoch.strongtogether.dev"
    // This is CRITICAL to allow installing the Dev Client alongside the Production app.
    newConfig.ios.bundleIdentifier = BUNDLE_ID_BASE + DEV_BUNDLE_SUFFIX;

    // 3. Change Android Package: "com.kobihanoch.strongtogether.dev"
    // This is CRITICAL for Android to allow parallel installation.
    newConfig.android.package = BUNDLE_ID_BASE + DEV_BUNDLE_SUFFIX;
    
    // Optional: Change notification color to indicate Dev environment
    newConfig.notification.color = "#FFC107"; // Example: Yellow for development alerts
  }

  return newConfig;
};

export default config;