const APP_NAME_BASE = "Strong Together";
const BUNDLE_ID_BASE = "com.kobihanoch.strongtogether";

// Prefer explicit APP_PROFILE injected by eas.json; fallback to EAS_BUILD_PROFILE; else "development"
const buildProfile =
  process.env.APP_PROFILE || process.env.EAS_BUILD_PROFILE || "development";

const config = ({ config }) => {
  const isProd = buildProfile === "production";

  const iosBundle = isProd ? BUNDLE_ID_BASE : `${BUNDLE_ID_BASE}.dev`;

  // Hard guard: prevent accidental ".dev" on production builds
  if (isProd && iosBundle.endsWith(".dev")) {
    throw new Error(
      "Prod build detected but bundleIdentifier resolved to .dev"
    );
  }

  const androidPackage = isProd ? BUNDLE_ID_BASE : `${BUNDLE_ID_BASE}.dev`;

  return {
    ...config,
    name: isProd ? APP_NAME_BASE : `${APP_NAME_BASE} (Dev)`,
    scheme: "strongtogether",
    slug: "strong-together",
    version: "4.4.0",
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
      color: isProd ? "#FFFFFF" : "#FFC107",
    },
    web: { favicon: "./assets/favicon.png" },
    plugins: [
      ["expo-notifications", { mode: "production" }],
      "expo-localization",
      "expo-font",
      "expo-secure-store",
      "expo-apple-authentication",
    ],
    extra: {
      eas: { projectId: "c2039946-58ec-44b1-beb0-cb0a69f01873" },
      buildProfile, // keep for debugging
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: iosBundle,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSPhotoLibraryUsageDescription:
          "We use your photo library so you can select a profile picture for your account.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#2979ff",
      },
      package: androidPackage,
    },
  };
};

export default config;
