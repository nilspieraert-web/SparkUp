import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const ThemedView: React.FC<ViewProps> = ({ style, children, ...rest }) => {
  const { theme } = useTheme();
  return (
    <View {...rest} style={[styles.base, { backgroundColor: theme.colors.background }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
