import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { AppThemeColors, AppThemeMode, themePalettes } from '../constants/theme';
import useToggleStatusBarColor from '../hooks/use-toggle-status-bar-color.hook';

const AppThemeContext = createContext<{
  mode: AppThemeMode;
  setMode: React.Dispatch<React.SetStateAction<AppThemeMode>>;
  colors: AppThemeColors;
} | null>(null);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<AppThemeMode>('light');
  useToggleStatusBarColor(mode);

  const value = useMemo(() => ({ mode, colors: themePalettes[mode], setMode }), [mode, setMode]);
  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export const useAppTheme = () => {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return ctx;
};
