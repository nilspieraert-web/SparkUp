import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritesStackParamList } from './types';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { GameDetailScreen } from '../screens/discover/GameDetailScreen';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export const FavoritesNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerTitle: 'Favorites' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ headerTitle: 'Game details' }} />
    </Stack.Navigator>
  );
};
