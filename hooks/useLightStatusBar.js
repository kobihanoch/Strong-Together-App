import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { StatusBar } from "react-native";

const useLightStatusBar = () => {
  useFocusEffect(
    useCallback(() => {
      // Switch to light icons immediately (no fade)
      StatusBar.setBarStyle("light-content", false);
      // Revert to the global default when leaving the screen
      return () => {
        StatusBar.setBarStyle("dark-content", false);
      };
    }, [])
  );
};

export default useLightStatusBar;
