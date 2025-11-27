import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { GameEditorScreen } from '../screens/profile/GameEditorScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerTitle: 'Profile' }} />
      <Stack.Screen name="GameEditor" component={GameEditorScreen} options={{ headerTitle: 'Game editor' }} />
    </Stack.Navigator>
  );
};
