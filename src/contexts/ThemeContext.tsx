import React, { createContext, useContext, useMemo } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { ThemePreference } from '../types/settings';
import { AppTheme, resolveTheme } from '../../utils/theme';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setTheme as setThemeAction } from '../features/settings/settingsSlice';

interface ThemeContextValue {
  theme: AppTheme;
  preference: ThemePreference;
  systemScheme: ColorSchemeName;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const preference = useAppSelector((state) => state.settings.theme);

  const theme = useMemo(() => resolveTheme(preference, systemScheme), [preference, systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      systemScheme,
      setTheme: (nextPreference: ThemePreference) => {
        dispatch(setThemeAction(nextPreference));
      },
    }),
    [theme, preference, systemScheme, dispatch],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
