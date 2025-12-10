import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameFilterState } from '../../types/game';

const initialState: GameFilterState = {
  indoorOutdoor: 'any',
  theme: null,
  minAge: null,
  maxAge: null,
  maxDuration: null,
  searchQuery: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ key: keyof GameFilterState; value: GameFilterState[keyof GameFilterState] }>) {
      const { key, value } = action.payload;
      state[key] = value as never;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setFilter, resetFilters } = filtersSlice.actions;
export const filtersReducer = filtersSlice.reducer;
