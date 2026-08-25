export type AppThemeMode = 'light' | 'dark';

export type AppThemeColors = {
  canvas: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primarySoft: string;
  achievement: string;
  achievementSoft: string;
  heroSurface: string;
  heroOverlay: string;
  white: string;
  profit: string;
};

export const lightThemeColors: AppThemeColors = {
  canvas: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceMuted: '#F2EEE8',
  border: '#E7E0D8',
  textPrimary: '#17130F',
  textSecondary: '#756B61',
  primary: '#2977ff',
  primarySoft: '#EAF2FF',
  achievement: '#E9A23B',
  achievementSoft: '#FFF5E5',
  heroSurface: '#17130F',
  heroOverlay: 'rgba(26, 26, 26, 0.76)',
  white: '#FFFFFF',
  profit: 'rgb(14, 138, 92)',
};

export const darkThemeColors: AppThemeColors = {
  canvas: '#100E0C',
  surface: '#1C1814',
  surfaceMuted: '#29231E',
  border: '#3A312A',
  textPrimary: '#F8F5F1',
  textSecondary: '#B8AEA4',
  primary: '#5B9BFF',
  primarySoft: '#172B49',
  achievement: '#F2B24F',
  achievementSoft: '#352817',
  heroSurface: '#080706',
  heroOverlay: 'rgba(0,0,0,0.58)',
  white: '#FFFFFF',
  profit: '#12c282ff',
};

export const themePalettes = { light: lightThemeColors, dark: darkThemeColors } as const;
