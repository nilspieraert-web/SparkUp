import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from './types';
import { DiscoverScreen } from '../screens/discover/DiscoverScreen';
import { GameDetailScreen } from '../screens/discover/GameDetailScreen';

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export const DiscoverNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Discover" component={DiscoverScreen} options={{ headerTitle: 'Discover games' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ headerTitle: 'Game details' }} />
    </Stack.Navigator>
  );
};
