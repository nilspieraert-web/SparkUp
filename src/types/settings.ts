export type ThemePreference = 'light' | 'dark' | 'system';

export interface SettingsState {
  theme: ThemePreference;
  language: string;
}
