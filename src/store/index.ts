import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authReducer } from '../features/auth/authSlice';
import { favoritesReducer } from '../features/favorites/favoritesSlice';
import { filtersReducer } from '../features/filters/filtersSlice';
import { settingsReducer } from '../features/settings/settingsSlice';
import { uiReducer } from '../features/ui/uiSlice';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['user'],
};

const favoritesPersistConfig = {
  key: 'favorites',
  storage: AsyncStorage,
};

const filtersPersistConfig = {
  key: 'filters',
  storage: AsyncStorage,
};

const settingsPersistConfig = {
  key: 'settings',
  storage: AsyncStorage,
};

const uiPersistConfig = {
  key: 'ui',
  storage: AsyncStorage,
  whitelist: ['badges', 'lastSeenFeedPosition'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
  filters: persistReducer(filtersPersistConfig, filtersReducer),
  settings: persistReducer(settingsPersistConfig, settingsReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
});

export const store = configureStore({
  reducer: persistReducer(
    {
      key: 'root',
      storage: AsyncStorage,
      blacklist: ['auth', 'favorites', 'filters', 'settings', 'ui'],
    },
    rootReducer,
  ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
