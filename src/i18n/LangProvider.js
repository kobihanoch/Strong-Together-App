// English comments only inside the code
import React from "react";
import { View, I18nManager } from "react-native";
import { getLocales } from "expo-localization";
import i18n, { bootstrapI18n, changeLanguage } from "./i18n";

// Single file: Context + hook + Provider
export const LangContext = React.createContext({
  lang: "en",
  isRTL: false,
  setLang: async () => {},
});

export function useLang() {
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

// Minimal RTL language detection; extend if needed
const RTL_LANG_PREFIXES = ["he", "ar", "fa", "ur"];
const isLangRTL = (lng) =>
  RTL_LANG_PREFIXES.some((p) => (lng || "").toLowerCase().startsWith(p));

export default function LangProvider({ children }) {
  const [lang, setLangState] = React.useState("en");
  const [ready, setReady] = React.useState(false);

  // Initialize i18n (reads AsyncStorage or device locale)
  React.useEffect(() => {
    (async () => {
      const current = await bootstrapI18n();
      setLangState(current);
      setReady(true);
    })();
  }, []);

  // Derive RTL from language or device direction
  const isRTL = isLangRTL(lang);

  // Allow RTL in RN engine (soft RTL; no force mirroring)
  React.useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.swapLeftAndRightInRTL(true);
  }, []);

  const ctxValue = React.useMemo(
    () => ({
      lang,
      isRTL,
      setLang: async (lng) => {
        await changeLanguage(lng);
        setLangState(lng);
      },
    }),
    [lang, isRTL]
  );

  if (!ready) return <View style={{ flex: 1 }} />;

  // Root wrapper applies writing direction so children inherit it
  return (
    <View
      style={{
        flex: 1,
        direction: isRTL ? "rtl" : "ltr",
        writingDirection: isRTL ? "rtl" : "ltr",
      }}
    >
      <LangContext.Provider value={ctxValue}>{children}</LangContext.Provider>
    </View>
  );
}
