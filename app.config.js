import "dotenv/config";

export default {
  expo: {
    name: "Strong Together",
    slug: "strong-together",
    version: "2.12.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#2979ff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kobihanoch.strongtogether",
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
    plugins: ["expo-font"],
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
