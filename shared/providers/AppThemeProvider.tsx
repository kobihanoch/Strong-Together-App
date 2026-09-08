import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { AppThemeColors, AppThemeMode, themePalettes } from '../constants/theme';
import useToggleStatusBarColor from '../hooks/use-toggle-status-bar-color.hook';
import { useAppThemeStore } from '../stores/app-theme.store';

const AppThemeContext = createContext<{
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
  colors: AppThemeColors;
} | null>(null);

/**
 * Publishes the persisted theme mode, matching color palette, and mode setter,
 * while synchronizing the native status bar whenever the preference changes.
 *
 * @param children - Descendants that consume theme state through `useAppTheme`.
 * @returns A context provider containing the active mode, palette, and setter.
 */
export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const mode = useAppThemeStore((state) => state.mode);
  const setMode = useAppThemeStore((state) => state.setMode);
  useToggleStatusBarColor(mode);

  const value = useMemo(() => ({ mode, colors: themePalettes[mode], setMode }), [mode, setMode]);
  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
};

/**
 * Reads the current application theme and fails fast when used outside its provider.
 *
 * @returns The active mode, resolved color palette, and persistent mode setter.
 * @throws Error when no `AppThemeProvider` is present above the caller.
 */
export const useAppTheme = () => {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return ctx;
};
