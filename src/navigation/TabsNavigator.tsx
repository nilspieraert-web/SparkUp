import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './types';
import { DiscoverNavigator } from './DiscoverNavigator';
import { LogNavigator } from './LogNavigator';
import { FavoritesNavigator } from './FavoritesNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { TabBarIcon } from '../components/TabBarIcon';
import { useAppSelector } from '../hooks/useRedux';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabsNavigator: React.FC = () => {
  const favoritesCount = useAppSelector((state) => state.favorites.ids.length);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DiscoverStack"
        component={DiscoverNavigator}
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabBarIcon name="compass-outline" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="LogStack"
        component={LogNavigator}
        options={{
          title: 'Log',
          tabBarIcon: ({ focused }) => <TabBarIcon name="create-outline" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="FavoritesStack"
        component={FavoritesNavigator}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused }) => <TabBarIcon name="heart-outline" focused={focused} />,
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon name="person-circle-outline" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
