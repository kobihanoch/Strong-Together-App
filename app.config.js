export default {
  expo: {
    name: "Strong Together",
    slug: "strong-together",
    version: "4.0.1",
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
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.kobihanoch.strongtogether",
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
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseEdgeUrl: process.env.SUPABASE_EDGE_URL,
      supabaseRef: process.env.SUPABASE_REF,
    },
  },
};
