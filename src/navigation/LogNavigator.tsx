import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogStackParamList } from './types';
import { LogSessionScreen } from '../screens/log/LogSessionScreen';
import { SessionDetailScreen } from '../screens/log/SessionDetailScreen';

const Stack = createNativeStackNavigator<LogStackParamList>();

export const LogNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LogSession" component={LogSessionScreen} options={{ headerTitle: 'Log session' }} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ headerTitle: 'Session detail' }} />
    </Stack.Navigator>
  );
};
