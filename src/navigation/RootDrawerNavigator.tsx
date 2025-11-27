import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { RootDrawerParamList } from './types';
import { TabsNavigator } from './TabsNavigator';
import { MyLogsScreen } from '../screens/shared/MyLogsScreen';
import { HelpScreen } from '../screens/shared/HelpScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export const RootDrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={TabsNavigator} options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="MyLogs" component={MyLogsScreen} options={{ drawerLabel: 'My logs' }} />
      <Drawer.Screen name="Help" component={HelpScreen} options={{ drawerLabel: 'About & Help' }} />
    </Drawer.Navigator>
  );
};
