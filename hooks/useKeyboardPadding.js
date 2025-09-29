import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export const useKeyboardPadding = () => {
  const [pad, setPad] = useState(0);
  useEffect(() => {
    const s = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setPad(e.endCoordinates?.height ?? 0)
    );
    const h = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setPad(0)
    );
    return () => {
      s.remove();
      h.remove();
    };
  }, []);
  return pad;
};
