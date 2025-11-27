import React from 'react';
import { Pressable, StyleSheet, TextStyle, ViewStyle, StyleProp } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../contexts/ThemeContext';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, onPress, disabled = false, style, textStyle }) => {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? theme.colors.muted : theme.colors.primary },
        style,
      ]}
      hitSlop={12}
    >
      <ThemedText
        variant="subheading"
        style={[
          styles.label,
          { color: '#FFFFFF' },
          textStyle,
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
  },
});

