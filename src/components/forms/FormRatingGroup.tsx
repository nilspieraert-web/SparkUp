import React from 'react';
import { useField } from 'formik';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '../../contexts/ThemeContext';

interface FormRatingGroupProps {
  name: string;
  label: string;
  options: readonly number[];
}

export const FormRatingGroup: React.FC<FormRatingGroupProps> = ({ name, label, options }) => {
  const [field, , helpers] = useField<number>(name);
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText variant="subheading" style={styles.label}>
        {label}
      </ThemedText>
      <View style={styles.row}>
        {options.map((option) => {
          const isSelected = field.value === option;
          return (
            <Pressable
              key={option}
              onPress={() => helpers.setValue(option)}
              style={[
                styles.pill,
                {
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: isSelected ? theme.colors.secondary : 'transparent',
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <ThemedText style={{ color: isSelected ? theme.colors.text : theme.colors.muted }}>{option}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 48,
    alignItems: 'center',
  },
});
