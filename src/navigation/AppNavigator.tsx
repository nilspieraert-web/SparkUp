import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { RootDrawerNavigator } from './RootDrawerNavigator';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

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
  const { user, status } = useAuth();
  const { theme } = useTheme();

  const navigationTheme = React.useMemo(
    () => buildNavigationTheme(theme.colorScheme === 'dark', theme.colors),
    [theme],
  );

  if (status === 'loading') {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <RootDrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
