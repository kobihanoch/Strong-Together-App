import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { AppThemeMode, themePalettes } from '../constants/theme';

const MOCK_THEME_MODE: AppThemeMode = 'light';

const AppThemeContext = createContext({ mode: MOCK_THEME_MODE, colors: themePalettes[MOCK_THEME_MODE] });

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => ({ mode: MOCK_THEME_MODE, colors: themePalettes[MOCK_THEME_MODE] }), []);
  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

export const useAppTheme = () => useContext(AppThemeContext);
