import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, ThemePreference } from '../../types/settings';

const initialState: SettingsState = {
  theme: 'system',
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemePreference>) {
      state.theme = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
