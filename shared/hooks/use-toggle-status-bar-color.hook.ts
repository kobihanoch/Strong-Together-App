import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppThemeMode } from '../constants/theme';

const getBarStyle = (theme: AppThemeMode) => (theme === 'dark' ? 'light-content' : 'dark-content');

/** Applies a status-bar style and optionally restores another theme when the caller unmounts. */
const useToggleStatusBarColor = (theme: AppThemeMode, restoreTheme?: AppThemeMode): void => {
  useEffect(() => {
    StatusBar.setBarStyle(getBarStyle(theme), true);

    return () => {
      if (restoreTheme) StatusBar.setBarStyle(getBarStyle(restoreTheme), true);
    };
  }, [restoreTheme, theme]);
};

export default useToggleStatusBarColor;
