import { ColorSchemeName } from 'react-native';
import { ThemePreference } from '../src/types/settings';

export interface AppTheme {
  colorScheme: Exclude<ThemePreference, 'system'>;
  colors: {
    background: string;
    card: string;
    text: string;
    muted: string;
    primary: string;
    secondary: string;
    border: string;
    danger: string;
    success: string;
  };
}

export const lightTheme: AppTheme = {
  colorScheme: 'light',
  colors: {
    background: '#F9FBFF',
    card: '#FFFFFF',
    text: '#202124',
    muted: '#5F6368',
    primary: '#2563EB',
    secondary: '#60A5FA',
    border: '#E0E3E8',
    danger: '#DC2626',
    success: '#16A34A',
  },
};

export const darkTheme: AppTheme = {
  colorScheme: 'dark',
  colors: {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    muted: '#CBD5F5',
    primary: '#60A5FA',
    secondary: '#93C5FD',
    border: '#334155',
    danger: '#F87171',
    success: '#4ADE80',
  },
};

export const resolveTheme = (preference: ThemePreference, systemScheme: ColorSchemeName): AppTheme => {
  if (preference === 'system') {
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }
  return preference === 'dark' ? darkTheme : lightTheme;
};
