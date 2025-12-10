import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { RootDrawerNavigator } from './RootDrawerNavigator';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';

const buildNavigationTheme = (isDark: boolean, colors: ReturnType<typeof useTheme>['theme']['colors']): NavigationTheme => {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.secondary,
    },
  };
};

export const AppNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { user, status } = useAuth();

  const navigationTheme = React.useMemo(
    () => buildNavigationTheme(theme.colorScheme === 'dark', theme.colors),
    [theme],
  );

  if (status === 'loading') {
    return null;
  }

  return <NavigationContainer theme={navigationTheme}>{user ? <RootDrawerNavigator /> : <AuthNavigator />}</NavigationContainer>;
};
