import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./locales/en.json";
import he from "./locales/he.json";

const STORAGE_KEY = "language_preference";

export async function bootstrapI18n() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  const device = getLocales?.()[0];
  const deviceTag = device?.languageTag || "en";
  const initialLng =
    saved || (deviceTag.toLowerCase().startsWith("he") ? "he" : "en");

  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources: { en: { translation: en }, he: { translation: he } },
      lng: initialLng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
  }
  return i18n.language;
}

export async function changeLanguage(lng) {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem(STORAGE_KEY, lng);
}

export default i18n;
