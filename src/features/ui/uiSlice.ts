import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiState } from '../../types/ui';

const initialState: UiState = {
  badges: {
    favorites: 0,
    unreadNotifications: 0,
  },
  lastSeenFeedPosition: 0,
  isHydrated: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setBadgeCount(state, action: PayloadAction<{ key: keyof UiState['badges']; value: number }>) {
      const { key, value } = action.payload;
      state.badges[key] = value;
    },
    setLastSeenFeedPosition(state, action: PayloadAction<number>) {
      state.lastSeenFeedPosition = action.payload;
    },
    setUiHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
  },
});

export const { setBadgeCount, setLastSeenFeedPosition, setUiHydrated } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
