import { useEffect, useState } from 'react';
import { Keyboard, Platform, KeyboardEvent } from 'react-native';

export const useKeyboardPadding = (): number => {
  const [pad, setPad] = useState<number>(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const s = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      setPad(e.endCoordinates?.height ?? 0);
    });

    const h = Keyboard.addListener(hideEvent, () => {
      setPad(0);
    });

    return () => {
      s.remove();
      h.remove();
    };
  }, []);

  return pad;
};
