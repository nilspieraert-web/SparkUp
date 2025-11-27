import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, focused }) => {
  const { theme } = useTheme();
  return <Ionicons name={name} size={22} color={focused ? theme.colors.primary : theme.colors.muted} />;
};
