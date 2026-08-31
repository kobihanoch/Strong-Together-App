import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppThemeMode } from '../constants/theme';

const useToggleStatusBarColor = (theme: AppThemeMode): void => {
  useEffect(() => {
    const style = theme === 'dark' ? 'light-content' : 'dark-content';
    StatusBar.setBarStyle(style, true);
  }, [theme]);
};

export default useToggleStatusBarColor;
